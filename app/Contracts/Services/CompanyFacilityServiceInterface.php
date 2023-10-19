<?php

namespace App\Contracts\Services;

use App\Models\CompanyFacility;
use App\Services\Data\CompanyFacility\CreateCompanyFacilityRequest;
use App\Services\Data\CompanyFacility\GetCompanyFacilitiesRequest;
use Illuminate\Support\Collection;

interface CompanyFacilityServiceInterface
{
    // public function get( $data): array;

    public function getAll(GetCompanyFacilitiesRequest $data): Collection;

    public function store(CreateCompanyFacilityRequest $data): CompanyFacility;

    // public function update(UpdateAddressRequest $data): Address;

    // public function delete(DeleteCompanyRequest $data): bool;
}
