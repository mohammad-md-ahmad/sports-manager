<?php

namespace App\Contracts\Services;

use App\Models\CompanyCustomer;
use App\Services\Data\CompanyCustomer\CreateCompanyCustomerRequest;
use App\Services\Data\CompanyCustomer\DeleteCompanyCustomerRequest;
use App\Services\Data\CompanyCustomer\GetCompanyCustomerRequest;
use App\Services\Data\CompanyCustomer\GetCompanyCustomersRequest;
use App\Services\Data\CompanyCustomer\ToggleAutoApproveCompanyCustomerRequest;
use App\Services\Data\CompanyCustomer\UpdateCompanyCustomerRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CompanyCustomerServiceInterface
{
    public function get(GetCompanyCustomerRequest $data): CompanyCustomer;

    public function getAll(GetCompanyCustomersRequest $data): LengthAwarePaginator;

    public function store(CreateCompanyCustomerRequest $data): CompanyCustomer;

    public function update(UpdateCompanyCustomerRequest $data): CompanyCustomer;

    public function delete(DeleteCompanyCustomerRequest $data): bool;

    public function toggleAutoApprove(ToggleAutoApproveCompanyCustomerRequest $data): bool;
}
