<?php

namespace App\Contracts\Services;

use App\Models\CompanyFacility;
use App\Services\Data\CompanyFacility\CreateCompanyFacilityRequest;
use App\Services\Data\CompanyFacility\GetCompanyFacilitiesRequest;
use App\Services\Data\CompanyFacility\GetCompanyFacilityRequest;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CompanyFacilityServiceInterface
{
    public function get(GetCompanyFacilityRequest $data): CompanyFacility;

    public function getAll(): LengthAwarePaginator;

    public function getAllByCompany(GetCompanyFacilitiesRequest $data): Collection;

    public function store(CreateCompanyFacilityRequest $data): CompanyFacility;

    // public function update(UpdateAddressRequest $data): Address;

    // public function delete(DeleteCompanyRequest $data): bool;
}
