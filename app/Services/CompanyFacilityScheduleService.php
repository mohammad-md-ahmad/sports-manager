<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\CompanyFacilityScheduleServiceInterface;
use App\Models\Schedule;
use App\Models\ScheduleDetails;
use App\Services\Data\CompanyFacilitySchedule\CreateCompanyFacilityScheduleRequest;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CompanyFacilityScheduleService implements CompanyFacilityScheduleServiceInterface
{
    /**
     * @throws Exception
     */
    public function store(CreateCompanyFacilityScheduleRequest $data): ScheduleDetails
    {
        try {
            DB::beginTransaction();

            /** @var Schedule $companyFacilitySchedule */
            $companyFacilitySchedule = Schedule::create([
                'company_facility_id' => $data->company_facility->id,
            ]);

            /** @var ScheduleDetails $companyFacilityScheduleDetails */
            $companyFacilityScheduleDetails = ScheduleDetails::create(array_merge($data->toArray(), [
                'schedule_id' => $companyFacilitySchedule->id,
            ]));

            DB::commit();

            return $companyFacilityScheduleDetails;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('CompanyFacilityScheduleService::store: '.$exception->getMessage());

            throw $exception;
        }
    }
}
