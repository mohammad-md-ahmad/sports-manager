<?php

namespace App\Contracts\Services;

use App\Models\ScheduleDetails;
use App\Services\Data\CompanyFacilitySchedule\CreateCompanyFacilityScheduleRequest;

interface CompanyFacilityScheduleServiceInterface
{
    public function store(CreateCompanyFacilityScheduleRequest $data): ScheduleDetails;
}
