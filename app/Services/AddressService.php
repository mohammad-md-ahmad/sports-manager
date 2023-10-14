<?php

namespace App\Services;

use App\Contracts\Services\AddressServiceInterface;
use App\Models\Company;
use App\Services\Data\Company\CreateCompanyRequest;
use App\Services\Data\Company\DeleteCompanyRequest;
use App\Services\Data\Company\GetCompanyRequest;
use App\Services\Data\Company\UpdateCompanyRequest;
use Exception;
use Illuminate\Support\Facades\Log;

class AddressService implements AddressServiceInterface
{
    public function get(GetCompanyRequest $data): array
    {
        try {
            /** @var Company $company */
            $company = Company::findOrFail($data->id);

            return $company->toArray();
        } catch (Exception $exception) {
            Log::error('CompanyService::get: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function store(CreateCompanyRequest $data): array
    {
        try {
            /** @var Company $company */
            $company = Company::create($data->toArray());

            return $company->toArray();
        } catch (Exception $exception) {
            Log::error('CompanyService::store: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function update(UpdateCompanyRequest $data): array
    {
        try {
            /** @var Company $company */
            $company = Company::findOrFail($data->id);

            $company->update($data->toArray());

            return $company->toArray();
        } catch (Exception $exception) {
            Log::error('CompanyService::update: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function delete(DeleteCompanyRequest $data): bool
    {
        try {
            return Company::findOrFail($data->id)->delete();
        } catch (Exception $exception) {
            Log::error('CompanyService::delete: '.$exception->getMessage());

            throw $exception;
        }
    }
}
