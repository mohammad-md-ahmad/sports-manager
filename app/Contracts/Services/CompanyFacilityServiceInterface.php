<?php

namespace App\Contracts\Services;

use App\Models\CompanyFacility;
use App\Services\Data\CompanyFacility\CreateCompanyFacilityRequest;
use App\Services\Data\CompanyFacility\GetCompanyFacilitiesRequest;
use App\Services\Data\CompanyFacility\GetCompanyFacilityRequest;
use App\Services\Data\CompanyFacility\SearchCompanyFacilitiesRequest;
use App\Services\Data\CompanyFacility\UpdateCompanyFacilityRequest;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CompanyFacilityServiceInterface
{
    public function get(GetCompanyFacilityRequest $data): CompanyFacility;

    public function getAll(SearchCompanyFacilitiesRequest $data): LengthAwarePaginator;

    public function getAllByCompany(GetCompanyFacilitiesRequest $data): Collection;

    public function store(CreateCompanyFacilityRequest $data): CompanyFacility;

    public function update(UpdateCompanyFacilityRequest $data): CompanyFacility;

    // public function delete(DeleteCompanyRequest $data): bool;
}
