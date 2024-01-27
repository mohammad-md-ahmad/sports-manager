<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\ReportServiceInterface;
use App\Enums\Report;
use App\Models\Company;
use App\Services\Data\Report\GetReportByKey;
use Exception;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReportService implements ReportServiceInterface
{
    protected Company $company;

    public function get(GetReportByKey $data): Collection
    {
        try {
            $this->company = $data->company;

            $data = match ($data->key) {
                Report::CustomerDemographics->name => $this->getCompanyCustomersDemograhpicsReport(),
            };

            return $data;
        } catch (Exception $exception) {
            Log::error('ReportService::get: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function getCompanyCustomersDemograhpicsReport()
    {
        try {
            $customers = DB::table('users', 'u');

            $customers->select([
                DB::raw("LOWER(CONCAT(
                    SUBSTR(HEX(u.uuid), 1, 8), '-',
                    SUBSTR(HEX(u.uuid), 9, 4), '-',
                    SUBSTR(HEX(u.uuid), 13, 4), '-',
                    SUBSTR(HEX(u.uuid), 17, 4), '-',
                    SUBSTR(HEX(u.uuid), 21)
                  )) AS uuid"),
                'u.first_name',
                'u.last_name',
            ])->join('bookings AS b', function (Builder $query) {
                $query->on('b.customer_user_id', '=', 'u.id');
            })->join('schedule_details AS sd', function (Builder $query) {
                $query->on('b.schedule_details_id', '=', 'sd.id');
            })->join('schedules AS s', function (Builder $query) {
                $query->on('sd.schedule_id', '=', 's.id');
            })->join('company_facilities AS cf', function (Builder $query) {
                $query->on('s.company_facilitY_id', '=', 'cf.id');
            })->join('companies AS c', function (Builder $query) {
                $query->on('cf.company_id', '=', 'c.id');
            })->where('c.id', $this->company->id)
                ->groupBy(['u.uuid', 'u.first_name', 'u.last_name']);

            $results = $customers->get();

            return $results;
        } catch (Exception $exception) {
            throw $exception;
        }
    }
}
