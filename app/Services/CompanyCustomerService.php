<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\CompanyCustomerServiceInterface;
use App\Models\CompanyCustomer;
use App\Services\Data\CompanyCustomer\CreateCompanyCustomerRequest;
use App\Services\Data\CompanyCustomer\DeleteCompanyCustomerRequest;
use App\Services\Data\CompanyCustomer\GetCompanyCustomerRequest;
use App\Services\Data\CompanyCustomer\GetCompanyCustomersRequest;
use App\Services\Data\CompanyCustomer\ToggleAutoApproveCompanyCustomerRequest;
use App\Services\Data\CompanyCustomer\UpdateCompanyCustomerRequest;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CompanyCustomerService implements CompanyCustomerServiceInterface
{
    public function get(GetCompanyCustomerRequest $data): CompanyCustomer
    {
        try {
            return $data->companyCustomer;
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    public function getAll(GetCompanyCustomersRequest $data): LengthAwarePaginator
    {
        try {
            return $data->company->customers()->with('customer')->jsonPaginate();
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    public function store(CreateCompanyCustomerRequest $data): CompanyCustomer
    {
        try {
            DB::beginTransaction();

            $companyCustomer = CompanyCustomer::create(array_merge([
                'company_id' => $data->company->id,
            ], $data->toArray()));

            DB::commit();

            return $companyCustomer;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    public function update(UpdateCompanyCustomerRequest $data): CompanyCustomer
    {
        try {
            DB::beginTransaction();

            $data->companyCustomer->update($data->toArray());

            DB::commit();

            $data->companyCustomer->refresh();

            return $data->companyCustomer;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    public function delete(DeleteCompanyCustomerRequest $data): bool
    {
        try {
            DB::beginTransaction();

            $data->companyCustomer->delete();

            DB::commit();

            return true;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    public function toggleAutoApprove(ToggleAutoApproveCompanyCustomerRequest $data): bool
    {
        try {
            /** @var CompanyCustomer $companyCustomerRecord */
            $companyCustomerRecord = CompanyCustomer::findOrFail($data->id);

            DB::beginTransaction();

            $autoApprove = ! empty($companyCustomerRecord->settings['auto_approve']) ? ! $companyCustomerRecord->settings['auto_approve'] : true;

            $companyCustomerRecord->update([
                'settings->auto_approve' => $autoApprove,
            ]);

            DB::commit();

            return true;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error($exception->getMessage());

            throw $exception;
        }
    }
}
