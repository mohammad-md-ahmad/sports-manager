<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\CompanyFacilityScheduleServiceInterface;
use App\Models\Schedule;
use App\Models\ScheduleDetails;
use App\Services\Data\CompanyFacilitySchedule\CreateCompanyFacilityScheduleBatchRequest;
use App\Services\Data\CompanyFacilitySchedule\CreateCompanyFacilityScheduleRequest;
use Carbon\Carbon;
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

    /**
     * @throws Exception
     */
    public function storeBatch(CreateCompanyFacilityScheduleBatchRequest $data): bool
    {
        try {
            $currentDate = Carbon::parse($data->date_from);
            $endTime = Carbon::parse($data->date_to)->addDay();
            $startTime = Carbon::parse($data->time_from);

            DB::beginTransaction();

            /** @var Schedule $companyFacilitySchedule */
            $companyFacilitySchedule = Schedule::create([
                'company_facility_id' => $data->company_facility->id,
            ]);

            while ($currentDate < $endTime) {
                $currentTime = $startTime;
                $endOfDay = $currentDate->copy()->setTimeFromTimeString($data->time_to);

                while ($currentTime < $endOfDay) {
                    $dateTimeFrom = $currentDate->copy()->setTimeFromTimeString($currentTime->toTimeString());
                    $dateTimeTo = $dateTimeFrom->copy()->addMinutes($data->slot);

                    if ($dateTimeTo > $endOfDay) {
                        $dateTimeTo = $endOfDay;
                    }

                    ScheduleDetails::create([
                        'schedule_id' => $companyFacilitySchedule->id,
                        'date_time_from' => $dateTimeFrom,
                        'date_time_to' => $dateTimeTo,
                    ]);

                    $currentTime = $dateTimeTo;
                }

                $currentDate->addDay();
            }

            DB::commit();

            return true;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('CompanyFacilityScheduleService::storeBatch: '.$exception->getMessage());

            throw $exception;
        }
    }
}
