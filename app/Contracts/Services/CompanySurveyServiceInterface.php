<?php

namespace App\Contracts\Services;

use App\Models\CompanyFacility;
use App\Models\CompanySurvey;
use App\Services\Data\CompanyFacility\GetCompanyFacilitiesRequest;
use App\Services\Data\CompanyFacility\UpdateCompanyFacilityRequest;
use App\Services\Data\CompanySurvey\CreateCompanySurveyRequest;
use App\Services\Data\CompanySurvey\GetAllCompanySurveysRequest;
use App\Services\Data\CompanySurvey\GetCompanySurveyRequest;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface CompanySurveyServiceInterface
{
    public function get(GetCompanySurveyRequest $data): CompanySurvey;

    public function getAllByCompany(GetAllCompanySurveysRequest $data): LengthAwarePaginator;

    // public function getAllByCompany(GetCompanyFacilitiesRequest $data): Collection;

    public function store(CreateCompanySurveyRequest $data): CompanySurvey;

    // public function update(UpdateCompanyFacilityRequest $data): CompanyFacility;
}
