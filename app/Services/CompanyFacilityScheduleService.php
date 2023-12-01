<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\CompanyFacilityScheduleServiceInterface;
use App\Enums\ScheduleDetailsStatus;
use App\Models\Company;
use App\Models\CompanyFacility;
use App\Models\Schedule;
use App\Models\ScheduleDetails;
use App\Services\Data\CompanyFacilitySchedule\CreateCompanyFacilityScheduleBatchRequest;
use App\Services\Data\CompanyFacilitySchedule\CreateCompanyFacilityScheduleRequest;
use App\Services\Data\CompanyFacilitySchedule\GetCompanyFacilityScheduleRequest;
use App\Services\Data\CompanyFacilitySchedule\GetCompanyScheduleRequest;
use App\Services\Data\CompanyFacilitySchedule\GetScheduleRequest;
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
                    ->select(['date_time_from', 'date_time_to', 'uuid', 'status']);
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
                        $class->uuid = $dateData->uuid;
                        $class->status = $dateData->status->name;
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
                ->select(['date_time_from', 'date_time_to', 'uuid', 'status']);
        });

        return $scheduleQuery->get();
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
                    ->select(['date_time_from', 'date_time_to', 'uuid', 'status']);
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
                        $class->uuid = $dateData->uuid;
                        $class->status = $dateData->status->name;
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
                ->select(['date_time_from', 'date_time_to', 'uuid', 'status']);
        });

        return $scheduleQuery->get();
    }

    /**
     * @throws Exception
     */
    public function getSchedule(GetScheduleRequest $data): Collection
    {
        try {
            $basicScheduleByMonthDaysQuery = $this->scheduleByMonthDaysQuery($data);

            $monthDaysQuery = clone $basicScheduleByMonthDaysQuery;
            $monthDaysQuery = $monthDaysQuery->select([
                DB::raw('DISTINCT DATE_FORMAT(date_time_from, "%Y-%m-%d") AS month_day'),
            ]);

            $daySlotsCountQuery = clone $basicScheduleByMonthDaysQuery;
            $daySlotsCountQuery = $daySlotsCountQuery->select(
                DB::raw('count(id) as count, DATE_FORMAT(date_time_from, "%Y-%m-%d") AS month_day')
            )->groupByRaw('month_day')->get();
            $daySlotsCountArr = [];

            foreach ($daySlotsCountQuery as $daySlot) {
                /** @var ScheduleDetails $daySlot */
                $daySlotsCountArr[$daySlot->month_day] = ! empty($daySlotsCountArr[$daySlot->month_day]) ? $daySlotsCountArr[$daySlot->month_day] + $daySlot->count : $daySlot->count;
            }

            $daySlotsStatusesCountQuery = clone $basicScheduleByMonthDaysQuery;
            $daySlotsStatusesCountQuery = $daySlotsStatusesCountQuery->select(
                DB::raw('count(id) as count, DATE_FORMAT(date_time_from, "%Y-%m-%d") AS month_day, status')
            )->groupBy(['month_day', 'status'])->get();

            $monthDays = $monthDaysQuery->get();

            $result = $monthDays->mapWithKeys(function ($monthDay) use ($data, $daySlotsStatusesCountQuery, $daySlotsCountArr) {
                $daySchedules = ScheduleDetails::with(['bookings.customer_user', 'schedule.facility.company'])
                    ->where(DB::raw('DATE_FORMAT(date_time_from, "%Y-%m-%d")'), $monthDay->month_day)
                    ->when($data->company_id, function (Builder $query) use ($data) {
                        $query->whereHas('schedule', function (Builder $query) use ($data) {
                            $query->whereHas('facility', function (Builder $query) use ($data) {
                                $query->where('company_id', $data->company_id);
                            });
                        });
                    })->when($data->facility_id, function (Builder $query) use ($data) {
                        $query->whereHas('schedule', function (Builder $query) use ($data) {
                            $query->whereHas('facility', function (Builder $query) use ($data) {
                                $query->where('id', $data->facility_id);
                            });
                        });
                    })->when($data->customer_user_id, function (Builder $query) use ($data) {
                        $query->whereHas('bookings', function (Builder $query) use ($data) {
                            $query->where('customer_user_id', $data->customer_user_id);
                        });
                    })->get();

                $pendingCount = 0;
                $availableCount = 0;
                $bookedCount = 0;

                foreach ($daySlotsStatusesCountQuery as $dayStatus) {
                    /** @var ScheduleDetails $dayStatus */
                    if ($dayStatus->month_day == $monthDay->month_day) {
                        if ($dayStatus->status == ScheduleDetailsStatus::Pending) {
                            $pendingCount = $dayStatus->count;
                        } elseif ($dayStatus->status == ScheduleDetailsStatus::Booked) {
                            $bookedCount = $dayStatus->count;
                        } elseif ($dayStatus->status == ScheduleDetailsStatus::Available) {
                            $availableCount = $dayStatus->count;
                        }
                    }
                }

                $hasAvailableSlot = $availableCount > 0;
                $hasPendingSlot = $pendingCount > 0;
                $hasBookedSlot = $bookedCount > 0;
                $dayIsFullyBooked = $bookedCount == ($daySlotsCountArr[$monthDay->month_day] ?? 0);

                $dayScheduleData = $daySchedules->map(function ($daySchedule) {
                    /** @var ScheduleDetails $daySchedule */

                    return [
                        'slot_uuid' => $daySchedule->uuid,
                        'date_time_from' => $daySchedule->date_time_from,
                        'date_time_to' => $daySchedule->date_time_to,
                        'status' => $daySchedule->status->name,
                        'bookings' => $daySchedule->bookings,
                        'facility' => array_merge(
                            $daySchedule->schedule->facility->withoutRelations()->toArray(), [
                                'gallery' => $daySchedule->schedule->facility->gallery,
                            ]),
                        'company' => $daySchedule->schedule->facility->company,
                    ];
                });

                $result = [
                    'data' => $dayScheduleData->toArray(),
                    'flags' => [
                        'hasAvailableSlot' => $hasAvailableSlot,
                        'hasPendingSlot' => $hasPendingSlot,
                        'hasBookedSlot' => $hasBookedSlot,
                        'dayIsFullyBooked' => $dayIsFullyBooked,
                    ],
                ];

                return [$monthDay->month_day => $result];
            });

            return $result;
        } catch (Exception $exception) {
            Log::error('CompanyFacilityScheduleService::getSchedule: '.$exception->getMessage());

            throw $exception;
        }
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

    protected function scheduleByMonthDaysQuery(GetScheduleRequest $data): Builder
    {
        $monthDaysQuery = ScheduleDetails::query();

        $monthDaysQuery->when($data->year_month, function (Builder $query) use ($data) {
            $query->where(DB::raw('DATE_FORMAT(date_time_from, "%Y-%m")'), '=', $data->year_month);
        });

        $monthDaysQuery->when($data->company_id, function (Builder $query) use ($data) {
            $query->whereHas('schedule', function (Builder $query) use ($data) {
                $query->whereHas('facility', function (Builder $query) use ($data) {
                    $query->where('company_id', $data->company_id);
                });
            });
        });

        $monthDaysQuery->when($data->facility_id, function (Builder $query) use ($data) {
            $query->whereHas('schedule', function (Builder $query) use ($data) {
                $query->whereHas('facility', function (Builder $query) use ($data) {
                    $query->where('id', $data->facility_id);
                });
            });
        });

        $monthDaysQuery->when($data->customer_user_id, function (Builder $query) use ($data) {
            $query->whereHas('bookings', function (Builder $query) use ($data) {
                $query->where('customer_user_id', $data->customer_user_id);
            });
        });

        return $monthDaysQuery;
    }
}
