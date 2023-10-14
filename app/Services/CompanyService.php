<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\AddressServiceInterface;
use App\Contracts\Services\CompanyServiceInterface;
use App\Contracts\Services\CompanyUserServiceInterface;
use App\Contracts\Services\UserServiceInterface;
use App\Enums\UserType;
use App\Models\Company;
use App\Services\Data\Company\CreateCompanyRequest;
use App\Services\Data\Company\DeleteCompanyRequest;
use App\Services\Data\Company\GetCompanyRequest;
use App\Services\Data\Company\UpdateCompanyRequest;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CompanyService implements CompanyServiceInterface
{
    public function __construct(
        protected UserServiceInterface $userService,
        protected CompanyUserServiceInterface $companyUserService,
        protected AddressServiceInterface $addressService,
    ) {
    }

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
            DB::beginTransaction();

            /** @var Company $company */
            $company = Company::create($data->toArray());

            if ($data->createUserRequest) {
                $data->createUserRequest->type = UserType::COMPANY_USER->name;

                /** @var User $user */
                $user = $this->userService->store($data->createUserRequest);

                $this->companyUserService->store($company->id, $user->id);
            }

            if ($data->createAddressRequest) {
                $data->createAddressRequest->model_type = Company::class;
                $data->createAddressRequest->model_id = (string) $company->id;

                $this->addressService->store($data->createAddressRequest);
            }

            DB::commit();

            return $company->toArray();
        } catch (Exception $exception) {
            DB::rollBack();

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
