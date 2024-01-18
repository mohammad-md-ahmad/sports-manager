<?php

namespace App\Contracts\Services;

use App\Models\CompanyFacility;
use App\Models\CompanySurvey;
use App\Services\Data\CompanyFacility\GetCompanyFacilitiesRequest;
use App\Services\Data\CompanyFacility\GetCompanyFacilityRequest;
use App\Services\Data\CompanyFacility\SearchCompanyFacilitiesRequest;
use App\Services\Data\CompanyFacility\UpdateCompanyFacilityRequest;
use App\Services\Data\CompanySurvey\CreateCompanySurveyRequest;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CompanySurveyServiceInterface
{
    // public function get(GetCompanyFacilityRequest $data): CompanyFacility;

    // public function getAll(SearchCompanyFacilitiesRequest $data): LengthAwarePaginator;

    // public function getAllByCompany(GetCompanyFacilitiesRequest $data): Collection;

    public function store(CreateCompanySurveyRequest $data): CompanySurvey;

    // public function update(UpdateCompanyFacilityRequest $data): CompanyFacility;
}
