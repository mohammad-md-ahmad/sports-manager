<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\AddressServiceInterface;
use App\Contracts\Services\CompanyFacilityServiceInterface;
use App\Contracts\Services\GalleryServiceInterface;
use App\Models\CompanyFacility;
use App\Services\Data\Address\CreateAddressRequest;
use App\Services\Data\CompanyFacility\CreateCompanyFacilityRequest;
use App\Services\Data\CompanyFacility\GetCompanyFacilitiesRequest;
use App\Services\Data\Gallery\CreateGalleryRequest;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CompanyFacilityService implements CompanyFacilityServiceInterface
{
    public function __construct(
        protected AddressServiceInterface $addressService,
        protected GalleryServiceInterface $galleryService,
    ) {
    }

    // public function get(GetCompanyRequest $data): array
    // {
    //     try {
    //         /** @var Company $company */
    //         $company = Company::findOrFail($data->id);

    //         return $company->toArray();
    //     } catch (Exception $exception) {
    //         Log::error('CompanyService::get: '.$exception->getMessage());

    //         throw $exception;
    //     }
    // }

    public function getAll(GetCompanyFacilitiesRequest $data): Collection
    {
        try {
            return $data->company->facilities()->with('address')->get();
        } catch (Exception $exception) {
            Log::error('CompanyFacilityService::getAll: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function store(CreateCompanyFacilityRequest $data): CompanyFacility
    {
        try {
            DB::beginTransaction();

            /** @var CompanyFacility $companyFacility */
            $companyFacility = CompanyFacility::create(array_merge($data->toArray(), ['company_id' => $data->company->id]));

            if ($data->createAddressRequest instanceof CreateAddressRequest) {
                $data->createAddressRequest->model_type = CompanyFacility::class;
                $data->createAddressRequest->model_id = (string) $companyFacility->id;

                $this->addressService->store($data->createAddressRequest);
            }

            if (count($data->companyFacilityPhotos) > 0) {
                foreach ($data->companyFacilityPhotos as $photo) {
                    $createGalleryRequest = new CreateGalleryRequest(
                        model_type: CompanyFacility::class,
                        model_id: (string) $companyFacility->id,
                        image: $photo,
                    );

                    $this->galleryService->store($createGalleryRequest);
                }
            }

            DB::commit();

            return $companyFacility;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('CompanyFacilityService::store: '.$exception->getMessage());

            throw $exception;
        }
    }

    // public function update(UpdateAddressRequest $data): Address
    // {
    //     try {
    //         /** @var Address $address */
    //         $address = Address::findOrFail($data->id);

    //         DB::beginTransaction();

    //         $address->update($data->toArray());

    //         DB::commit();

    //         return $address;
    //     } catch (Exception $exception) {
    //         DB::rollBack();

    //         Log::error('AddressService::update: '.$exception->getMessage());

    //         throw $exception;
    //     }
    // }

    // public function delete(DeleteCompanyRequest $data): bool
    // {
    //     try {
    //         return Company::findOrFail($data->id)->delete();
    //     } catch (Exception $exception) {
    //         Log::error('CompanyService::delete: '.$exception->getMessage());

    //         throw $exception;
    //     }
    // }
}
