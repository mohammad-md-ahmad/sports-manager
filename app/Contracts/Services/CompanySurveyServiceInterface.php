<?php

namespace App\Contracts\Services;

use App\Models\CompanySurvey;
use App\Services\Data\CompanySurvey\CreateCompanySurveyRequest;
use App\Services\Data\CompanySurvey\CreateUserResponseRequest;
use App\Services\Data\CompanySurvey\GetAllCompanySurveysRequest;
use App\Services\Data\CompanySurvey\GetCompanySurveyRequest;
use App\Services\Data\CompanySurvey\UpdateCompanySurveyRequest;
use Illuminate\Pagination\LengthAwarePaginator;

interface CompanySurveyServiceInterface
{
    public function get(GetCompanySurveyRequest $data): CompanySurvey;

    public function getAllByCompany(GetAllCompanySurveysRequest $data): LengthAwarePaginator;

    public function store(CreateCompanySurveyRequest $data): CompanySurvey;

    public function update(UpdateCompanySurveyRequest $data): CompanySurvey;

    public function userResponse(CreateUserResponseRequest $data): bool;
}
