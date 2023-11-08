<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\CompanyFacilityScheduleServiceInterface;
use App\Models\Company;
use App\Models\CompanyFacility;
use App\Models\Schedule;
use App\Models\ScheduleDetails;
use App\Services\Data\CompanyFacilitySchedule\CreateCompanyFacilityScheduleBatchRequest;
use App\Services\Data\CompanyFacilitySchedule\CreateCompanyFacilityScheduleRequest;
use App\Services\Data\CompanyFacilitySchedule\GetCompanyFacilityScheduleRequest;
use App\Services\Data\CompanyFacilitySchedule\GetCompanyScheduleRequest;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use stdClass;

class CompanyFacilityScheduleService implements CompanyFacilityScheduleServiceInterface
{
    /**
     * @throws Exception
     */
    public function getCompanySchedule(GetCompanyScheduleRequest $data): Collection|array|stdClass
    {
        try {
            /** @var Company $company */
            $company = Company::findOrFail($data->company_id);

            $scheduleQuery = ScheduleDetails::query();

            $scheduleQuery->whereHas('schedule', function (Builder $query) use ($company) {
                $query->whereHas('facility', function (Builder $query) use ($company) {
                    $query->whereHas('company', function (Builder $query) use ($company) {
                        $query->where('id', $company->id);
                    });
                });
            })->when($data->date, function (Builder $query) use ($data) {
                $query->whereDate('date_time_from', '>=', $data->date)
                    ->whereDate('date_time_to', '<=', $data->date)
                    ->select(['date_time_from', 'date_time_to']);
            }, function (Builder $query) {
                $query->selectRaw('DISTINCT DATE_FORMAT(date_time_from, "%Y-%m-%d") as custom_date')
                    ->orderBy('custom_date');
            });

            if (! $data->date) {
                $results = $scheduleQuery->distinct()
                    ->pluck('custom_date')
                    ->toArray();

                $formattedResponse = new stdClass();
                foreach ($results as $date) {
                    $class = new stdClass();

                    $data->date = $date;

                    $datesData = $this->getCompanyData($data);

                    foreach ($datesData as $dateData) {
                        $class->date_time_from = $dateData->date_time_from;
                        $class->date_time_to = $dateData->date_time_to;
                    }

                    $formattedResponse->{$date} = $class;
                }

                return $formattedResponse;
            }

            return $scheduleQuery->get();
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    private function getCompanyData(GetCompanyScheduleRequest $data)
    {
        /** @var Company $company */
        $company = Company::findOrFail($data->company_id);

        $scheduleQuery = ScheduleDetails::query();

        $scheduleQuery->whereHas('schedule', function (Builder $query) use ($company) {
            $query->whereHas('facility', function (Builder $query) use ($company) {
                $query->whereHas('company', function (Builder $query) use ($company) {
                    $query->where('id', $company->id);
                });
            });
        })->when($data->date, function (Builder $query) use ($data) {
            $query->whereDate('date_time_from', '>=', $data->date)
                ->whereDate('date_time_to', '<=', $data->date)
                ->select(['date_time_from', 'date_time_to']);
        });

        return $scheduleQuery->get();
    }

    /**
     * @throws Exception
     */
    public function getCompanySchedule2(GetCompanyScheduleRequest $data): stdClass|Collection
    {
        try {
            /** @var Company $company */
            $company = Company::findOrFail($data->company_id);

            $scheduleQuery = ScheduleDetails::query();

            $scheduleQuery->whereHas('schedule', function (Builder $query) use ($company) {
                $query->whereHas('facility', function (Builder $query) use ($company) {
                    $query->whereHas('company', function (Builder $query) use ($company) {
                        $query->where('id', $company->id);
                    });
                });
            })->when($data->date, function (Builder $query) use ($data) {
                $query->whereDate('date_time_from', '>=', $data->date)
                    ->whereDate('date_time_to', '<=', $data->date)
                    ->select(['date_time_from', 'date_time_to']);
            }, function (Builder $query) {
                $query->selectRaw('DISTINCT DATE_FORMAT(date_time_from, "%Y-%m-%d") as custom_date')
                    ->orderBy('custom_date');
            });

            if (! $data->date) {
                $results = $scheduleQuery->distinct()
                    ->pluck('custom_date')
                    ->toArray();

                $formattedResponse = new stdClass();
                foreach ($results as $date) {
                    $formattedResponse->{$date} = new stdClass();
                }

                return $formattedResponse;
            }

            return $scheduleQuery->get();
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function getFacilitySchedule(GetCompanyFacilityScheduleRequest $data): stdClass|\Illuminate\Database\Eloquent\Collection
    {
        try {
            /** @var CompanyFacility $facility */
            $facility = CompanyFacility::findOrFail($data->facility_id);

            $scheduleQuery = ScheduleDetails::query();

            $scheduleQuery->whereHas('schedule', function (Builder $query) use ($facility) {
                $query->whereHas('facility', function (Builder $query) use ($facility) {
                    $query->where('id', $facility->id);
                });
            })->when($data->date, function (Builder $query) use ($data) {
                $query->whereDate('date_time_from', '<=', $data->date)
                    ->whereDate('date_time_to', '>=', $data->date)
                    ->select(['date_time_from', 'date_time_to']);
            }, function (Builder $query) {
                $query->selectRaw('DISTINCT DATE_FORMAT(date_time_from, "%Y-%m-%d") as custom_date')
                    ->orderBy('custom_date');
            });

            if (! $data->date) {
                $results = $scheduleQuery->distinct()
                    ->pluck('custom_date')
                    ->toArray();

                $formattedResponse = new stdClass();
                foreach ($results as $date) {
                    $class = new stdClass();

                    $data->date = $date;

                    $datesData = $this->getFacilityData($data);

                    foreach ($datesData as $dateData) {
                        $class->date_time_from = $dateData->date_time_from;
                        $class->date_time_to = $dateData->date_time_to;
                    }

                    $formattedResponse->{$date} = $class;
                }

                return $formattedResponse;
            }

            return $scheduleQuery->get();
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    public function getFacilityData(GetCompanyFacilityScheduleRequest $data)
    {
        /** @var CompanyFacility $facility */
        $facility = CompanyFacility::findOrFail($data->facility_id);

        $scheduleQuery = ScheduleDetails::query();

        $scheduleQuery->whereHas('schedule', function (Builder $query) use ($facility) {
            $query->whereHas('facility', function (Builder $query) use ($facility) {
                $query->where('id', $facility->id);
            });
        })->when($data->date, function (Builder $query) use ($data) {
            $query->whereDate('date_time_from', '<=', $data->date)
                ->whereDate('date_time_to', '>=', $data->date)
                ->select(['date_time_from', 'date_time_to']);
        });

        return $scheduleQuery->get();
    }

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
