<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\AddressServiceInterface;
use App\Models\Address;
use App\Services\Data\Address\CreateAddressRequest;
use App\Services\Data\Address\UpdateAddressRequest;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AddressService implements AddressServiceInterface
{
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

    public function store(CreateAddressRequest $data): Address
    {
        try {
            DB::beginTransaction();

            /** @var Address $address */
            $address = Address::create($data->toArray());

            DB::commit();

            return $address;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('AddressService::store: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function update(UpdateAddressRequest $data): Address
    {
        try {
            /** @var Address $address */
            $address = Address::findOrFail($data->id);

            DB::beginTransaction();

            $address->update($data->toArray());

            DB::commit();

            return $address;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('AddressService::update: '.$exception->getMessage());

            throw $exception;
        }
    }

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
