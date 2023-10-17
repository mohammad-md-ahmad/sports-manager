<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\AddressServiceInterface;
use App\Contracts\Services\CompanyServiceInterface;
use App\Contracts\Services\CompanyUserServiceInterface;
use App\Contracts\Services\UserServiceInterface;
use App\Enums\UserType;
use App\Models\Company;
use App\Services\Data\Address\CreateAddressRequest;
use App\Services\Data\Address\UpdateAddressRequest;
use App\Services\Data\Company\CreateCompanyRequest;
use App\Services\Data\Company\DeleteCompanyRequest;
use App\Services\Data\Company\GetCompanyRequest;
use App\Services\Data\Company\UpdateCompanyRequest;
use App\Services\Data\User\CreateUserRequest;
use App\Services\Data\User\UpdateUserRequest;
use App\Traits\ImageUpload;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CompanyService implements CompanyServiceInterface
{
    use ImageUpload;

    public function __construct(
        protected UserServiceInterface $userService,
        protected CompanyUserServiceInterface $companyUserService,
        protected AddressServiceInterface $addressService,
    ) {
    }

    public function get(GetCompanyRequest $data): Company
    {
        try {
            /** @var Company $company */
            $company = Company::findOrFail($data->id);

            return $company;
        } catch (Exception $exception) {
            Log::error('CompanyService::get: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function store(CreateCompanyRequest $data): Company
    {
        try {
            DB::beginTransaction();

            /** @var Company $company */
            $company = Company::create($data->toArray());

            if ($data->createUserRequest instanceof CreateUserRequest) {
                $data->createUserRequest->type = UserType::COMPANY_USER->name;

                /** @var User $user */
                $user = $this->userService->store($data->createUserRequest);

                $this->companyUserService->store($company->id, $user->id);
            }

            if ($data->createAddressRequest instanceof CreateAddressRequest) {
                $data->createAddressRequest->model_type = Company::class;
                $data->createAddressRequest->model_id = (string) $company->id;

                $this->addressService->store($data->createAddressRequest);
            }

            $uploadedImg = null;

            // after company got updated successfully, upload and update the logo
            if ($data->logo) {
                $uploadedImg = $this->uploadLogo($data->logo, $company->id);
                $company->logo = $uploadedImg;
                $company->save();
            }

            DB::commit();

            return $company;
        } catch (Exception $exception) {
            DB::rollBack();

            $this->deleteLogo($uploadedImg);

            Log::error('CompanyService::store: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function update(UpdateCompanyRequest $data): Company
    {
        try {
            /** @var Company $company */
            $company = Company::findOrFail($data->id);

            DB::beginTransaction();

            $company->update($data->toArray());

            if ($data->updateUserRequest instanceof UpdateUserRequest) {
                $data->updateUserRequest->type = UserType::COMPANY_USER->name;

                /** @var User $user */
                $this->userService->update($data->updateUserRequest);
            }

            if ($data->updateAddressRequest instanceof UpdateAddressRequest) {
                $data->updateAddressRequest->model_type = Company::class;
                $data->updateAddressRequest->model_id = (string) $company->id;

                $this->addressService->update($data->updateAddressRequest);
            }

            $uploadedImg = null;

            // after company got updated successfully, upload and update the logo
            if ($data->logo) {
                $uploadedImg = $this->uploadLogo($data->logo, $company->id);
                $company->logo = $uploadedImg;
                $company->save();
            }

            DB::commit();

            return $company;
        } catch (Exception $exception) {
            DB::rollBack();

            $this->deleteLogo($uploadedImg);

            Log::error('CompanyService::update: '.$exception->getMessage());

            throw $exception;
        }
    }

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

    private function deleteLogo(string $logo): bool
    {
        try {
            return Storage::disk('public')->delete($logo);
        } catch (Exception $exception) {
            Log::error('Delete company logo: '.$exception->getMessage());

            throw $exception;
        }
    }
}
