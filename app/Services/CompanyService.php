<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\AddressServiceInterface;
use App\Contracts\Services\CompanyServiceInterface;
use App\Contracts\Services\CompanyUserServiceInterface;
use App\Contracts\Services\GalleryServiceInterface;
use App\Contracts\Services\UserServiceInterface;
use App\Enums\UserType;
use App\Models\Company;
use App\Models\EntityPaymentMethod;
use App\Models\Gallery;
use App\Models\User;
use App\Services\Data\Address\CreateAddressRequest;
use App\Services\Data\Address\UpdateAddressRequest;
use App\Services\Data\Address\UpdateOrCreateAddressRequest;
use App\Services\Data\Company\CreateCompanyRequest;
use App\Services\Data\Company\DeleteCompanyRequest;
use App\Services\Data\Company\GetCompanyRequest;
use App\Services\Data\Company\SearchCompaniesRequest;
use App\Services\Data\Company\UpdateCompanyRequest;
use App\Services\Data\Gallery\CreateGalleryRequest;
use App\Services\Data\User\CreateUserRequest;
use App\Services\Data\User\UpdateUserRequest;
use App\Traits\ImageUpload;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CompanyService implements CompanyServiceInterface
{
    use ImageUpload;

    private array $relationships = ['address', 'gallery', 'ratings', 'paymentMethods', 'subscriptionPlans.subscriptionPlan'];

    public function __construct(
        protected UserServiceInterface $userService,
        protected CompanyUserServiceInterface $companyUserService,
        protected AddressServiceInterface $addressService,
        protected GalleryServiceInterface $galleryService,
    ) {
    }

    /**
     * @throws Exception
     */
    public function get(GetCompanyRequest $data): Company
    {
        try {
            /** @var Company $company */
            $company = Company::query()
                ->where('id', $data->id)
                ->with($this->relationships)
                ->get()
                ->first();

            return $company;
        } catch (Exception $exception) {
            Log::error('CompanyService::get: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function getAll(SearchCompaniesRequest $data): LengthAwarePaginator
    {
        try {
            $companiesQuery = Company::query();

            $companiesQuery->when($data->name, function (Builder $query) use ($data) {
                $query->where('name', 'LIKE', '%'.$data->name.'%');
            });

            $companiesQuery->when($data->status, function (Builder $query) use ($data) {
                $query->where('status', '=', $data->status);
            });

            $companiesQuery->when($data->type, function (Builder $query) use ($data) {
                $query->whereHas('facilities', function (Builder $query) use ($data) {
                    $query->where('type', $data->type);
                });
            });

            $companiesQuery->when($data->country_id, function (Builder $query) use ($data) {
                $query->whereHas('address', function (Builder $query) use ($data) {
                    $query->where('country_id', $data->country_id);
                });
            });

            $companiesQuery->when($data->city, function (Builder $query) use ($data) {
                $query->whereHas('address', function (Builder $query) use ($data) {
                    $query->where('city', 'LIKE', '%'.$data->city.'%');
                });
            });

            $companiesQuery->when($data->sport_id, function (Builder $query) use ($data) {
                $query->whereHas('facilities', function (Builder $query) use ($data) {
                    $query->where('sport_id', $data->sport_id);
                });
            });

            return $companiesQuery->with($this->relationships)->jsonPaginate();
        } catch (Exception $exception) {
            Log::error('CompanyService::get: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function store(CreateCompanyRequest $data): Company
    {
        $uploadedImg = null;

        try {
            DB::beginTransaction();

            /** @var Company $company */
            $company = Company::create($data->toArray());

            if ($data->createUserRequest instanceof CreateUserRequest) {
                $data->createUserRequest->type = UserType::COMPANY_USER->name;

                $user = $this->userService->store($data->createUserRequest);

                $this->companyUserService->store($company->id, $user->id);
            }

            if ($data->createAddressRequest instanceof CreateAddressRequest) {
                $data->createAddressRequest->model_type = Company::class;
                $data->createAddressRequest->model_id = (string) $company->id;

                $this->addressService->store($data->createAddressRequest);
            }

            // after company got updated successfully, upload and update the logo
            if ($data->logo && is_string($data->logo)) {

                $uploadedImg = $this->uploadLogo($data->logo, $company->id);
                $company->logo = $uploadedImg;
                $company->save();
            }

            if ($data->companyPhotos && count($data->companyPhotos) > 0) {
                $this->deleteOldGallery($company);

                foreach ($data->companyPhotos as $photo) {
                    $galleryData = [
                        'model_type' => Company::class,
                        'model_id' => (string) $company->id,
                        'image' => $photo,
                    ];

                    CreateGalleryRequest::validate($galleryData);
                    $createGalleryRequest = CreateGalleryRequest::from($galleryData);

                    $this->galleryService->store($createGalleryRequest);
                }
            }

            if ($data->payment_methods && count($data->payment_methods) > 0) {
                EntityPaymentMethod::updateOrCreate([
                    'entity_id' => $company->id,
                    'entity_type' => Company::class,
                ], [
                    'payment_methods' => $data->payment_methods,
                ]);
            }

            DB::commit();

            $company->refresh();

            return Company::with($this->relationships)->findOrFail($company->id);
        } catch (Exception $exception) {
            DB::rollBack();

            if ($uploadedImg) {
                $this->deleteLogo($uploadedImg);
            }

            Log::error('CompanyService::store: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function update(UpdateCompanyRequest $data): Company
    {
        $uploadedImg = null;

        try {
            /** @var Company $company */
            $company = Company::findOrFail($data->id);

            DB::beginTransaction();

            $company->update($data->toArray());

            if ($data->user instanceof UpdateUserRequest) {
                $data->user->type = UserType::COMPANY_USER->name;

                /** @var User $user */
                $this->userService->update($data->user);
            }

            if ($data->address instanceof UpdateOrCreateAddressRequest) {
                $data->address->model_type = Company::class;
                $data->address->model_id = (string) $company->id;

                if ($company->address) {
                    $updateAddressRequestData = array_merge($data->address->toArray(), [
                        'uuid' => $company->address->uuid,
                    ]);

                    UpdateAddressRequest::validate($updateAddressRequestData);

                    $updateAddressRequest = UpdateAddressRequest::from($updateAddressRequestData);

                    $this->addressService->update($updateAddressRequest);
                } else {
                    CreateAddressRequest::validate($data->address->toArray());

                    $createAddressRequest = CreateAddressRequest::from($data->address->toArray());

                    $this->addressService->store($createAddressRequest);
                }
            }

            // after company got updated successfully, upload and update the logo
            if ($data->logo && is_string($data->logo)) {
                $uploadedImg = $this->uploadLogo($data->logo, $company->id);
                $company->logo = $uploadedImg;
                $company->save();
            }
            if ($data->payment_methods && count($data->payment_methods) > 0) {
                EntityPaymentMethod::updateOrCreate([
                    'entity_id' => $company->id,
                    'entity_type' => Company::class,
                ], [
                    'payment_methods' => $data->payment_methods,
                ]);
            }
            if ($data->companyPhotos && count($data->companyPhotos) > 0) {
                $this->deleteOldGallery($company);

                foreach ($data->companyPhotos as $photo) {
                    $galleryData = [
                        'model_type' => Company::class,
                        'model_id' => (string) $company->id,
                        'image' => $photo,
                    ];

                    CreateGalleryRequest::validate($galleryData);
                    $createGalleryRequest = CreateGalleryRequest::from($galleryData);

                    $this->galleryService->store($createGalleryRequest);
                }
            }

            DB::commit();

            $company->refresh();

            return Company::with($this->relationships)->findOrFail($company->id);
        } catch (Exception $exception) {
            DB::rollBack();

            if ($uploadedImg = null) {
                $this->deleteLogo($uploadedImg);
            }

            Log::error('CompanyService::update: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function delete(DeleteCompanyRequest $data): bool
    {
        try {
            $company = Company::findOrFail($data->id);

            $this->deleteLogo($company->logo);

            return $company->delete();
        } catch (Exception $exception) {
            Log::error('CompanyService::delete: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    private function uploadLogo(string $logo, int|string $id = null): string
    {
        try {
            do {
                $logoData = $this->base64Decode($logo);
                $path = $this->base64ToImage($logo, 'company-logos', $logoData);
            } while (! Storage::disk('public')->put($path, $logoData));

            // delete the old logo
            if ($id) {
                /** @var Company $company */
                $company = Company::findOrFail($id);

                if ($company->logo) {
                    $this->deleteLogo($company->logo);
                }
            }

            return $path;
        } catch (Exception $exception) {
            Log::error('Uploading company logo: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    private function deleteLogo(string $logo): bool
    {
        try {
            return Storage::disk('public')->delete($logo);
        } catch (Exception $exception) {
            Log::error('Delete company logo: '.$exception->getMessage());

            throw $exception;
        }
    }

    private function deleteOldGallery(Company $company)
    {
        try {
            DB::transaction(function () use ($company) {
                $company->gallery->each(function (Gallery $galleryPhoto) {
                    $galleryPhoto->delete();
                });
            });
        } catch (Exception $exception) {
            throw $exception;
        }
    }
}
