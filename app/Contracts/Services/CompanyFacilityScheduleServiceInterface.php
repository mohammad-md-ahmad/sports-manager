<?php

namespace App\Contracts\Services;

use App\Models\ScheduleDetails;
use App\Services\Data\CompanyFacilitySchedule\CreateCompanyFacilityScheduleBatchRequest;
use App\Services\Data\CompanyFacilitySchedule\CreateCompanyFacilityScheduleRequest;
use App\Services\Data\CompanyFacilitySchedule\GetCompanyFacilityScheduleRequest;
use App\Services\Data\CompanyFacilitySchedule\GetCompanyScheduleRequest;
use App\Services\Data\CompanyFacilitySchedule\GetScheduleRequest;
use Illuminate\Support\Collection;
use stdClass;

interface CompanyFacilityScheduleServiceInterface
{
    public function getCompanySchedule(GetCompanyScheduleRequest $data): stdClass|Collection|array;

    public function getFacilitySchedule(GetCompanyFacilityScheduleRequest $data): stdClass|Collection|array;

    public function getSchedule(GetScheduleRequest $data): Collection;

    public function store(CreateCompanyFacilityScheduleRequest $data): ScheduleDetails;

    public function storeBatch(CreateCompanyFacilityScheduleBatchRequest $data): bool;
}
