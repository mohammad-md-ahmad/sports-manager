<?php

namespace App\Contracts\Services;

use App\Models\ScheduleDetails;
use App\Services\Data\CompanyFacilitySchedule\CreateCompanyFacilityScheduleBatchRequest;
use App\Services\Data\CompanyFacilitySchedule\CreateCompanyFacilityScheduleRequest;
use App\Services\Data\CompanyFacilitySchedule\GetCompanyFacilityScheduleRequest;
use App\Services\Data\CompanyFacilitySchedule\GetCompanyScheduleRequest;
use Illuminate\Database\Eloquent\Collection;

interface CompanyFacilityScheduleServiceInterface
{
    public function getCompanySchedule(GetCompanyScheduleRequest $data): Collection;

    public function getFacilitySchedule(GetCompanyFacilityScheduleRequest $data): Collection;

    public function store(CreateCompanyFacilityScheduleRequest $data): ScheduleDetails;

    public function storeBatch(CreateCompanyFacilityScheduleBatchRequest $data): bool;
}
