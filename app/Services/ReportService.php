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
                Report::CustomerDemographics->name => $this->getCompanyCustomersDemograhpicsReport($data),
            };

            return $data;
        } catch (Exception $exception) {
            Log::error('ReportService::get: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function getCompanyCustomersDemograhpicsReport(GetReportByKey $data)
    {
        try {
            $genders = $this->getCompanyCustomersGenderDemograhpics($data->company);
            $ages = $this->getCompanyCustomersAgeDemographics($data->company);

            $results = [
                'genders' => $genders,
                'ages' => $ages,
            ];

            return collect($results);
        } catch (Exception $exception) {
            throw $exception;
        }
    }

    protected function getCompanyCustomersGenderDemograhpics(Company $company)
    {
        $customersQuery = DB::table('users', 'u');

        $customersQuery->select([
            DB::raw('COUNT(DISTINCT upi.id) AS count'),
            'upi.gender',
        ])->join('user_personal_infos AS upi', function (Builder $query) {
            $query->on('upi.user_id', '=', 'u.id');
        })->join('companies AS c', function (Builder $query) {
            $query->where('c.id', $this->company->id);
        })->join('company_customers AS cc', function (Builder $query) {
            $query->on('cc.company_id', '=', 'c.id');
        })->groupBy(['upi.gender']);

        return $customersQuery->get();
    }

    protected function getCompanyCustomersAgeDemographics(Company $company)
    {
        $ageRanges = [
            'zeroToTwelve' => [0, 12],
            'twelveToEighteen' => [12, 18],
            'eighteenToTwentyFive' => [18, 25],
            'twentyfiveToForty' => [25, 40],
            'aboveForty' => [40, 200], // Adjust upper limit as needed
        ];

        // Subquery to calculate age ranges
        $ageRangesQuery = DB::table('users as u')
            ->select('cc.company_id')
            ->join('user_personal_infos AS upi', 'upi.user_id', '=', 'u.id')
            ->join('companies AS c', 'c.id', '=', $company->id, where: true)
            ->join('company_customers AS cc', 'cc.user_id', '=', 'u.id')
            ->groupBy(['cc.company_id']);

        // Define age ranges in the subquery
        foreach ($ageRanges as $range => $limits) {
            $ageRangesQuery->selectSub(
                "SUM(CASE WHEN YEAR(CURDATE()) - YEAR(upi.dob) - IF(STR_TO_DATE(CONCAT(YEAR(CURDATE()), '-', MONTH(upi.dob), '-', DAY(upi.dob)), '%Y-%m-%d') > CURDATE(), 1, 0) >= {$limits[0]} AND YEAR(CURDATE()) - YEAR(upi.dob) - IF(STR_TO_DATE(CONCAT(YEAR(CURDATE()), '-', MONTH(upi.dob), '-', DAY(upi.dob)), '%Y-%m-%d') > CURDATE(), 1, 0) <= {$limits[1]} THEN 1 ELSE 0 END)",
                $range
            );
        }

        // Use the subquery to calculate age ranges and join it with the main query
        $result = DB::table(DB::raw("({$ageRangesQuery->toSql()}) as age_ranges"))
            ->mergeBindings($ageRangesQuery)
            ->join('companies AS c', 'c.id', '=', 'age_ranges.company_id')
            ->groupBy(['age_ranges.company_id'])
            ->select(['age_ranges.company_id'])
            ->select(array_merge($this->getAgeRangeSelectExpressions($ageRanges)));

        return $result->get();
    }

    // Helper function to get age range select expressions
    protected function getAgeRangeSelectExpressions(array $ageRanges)
    {
        $ageRangeExpressions = [];

        foreach ($ageRanges as $range => $limits) {
            $ageRangeExpressions[] = DB::raw("COALESCE(SUM($range), 0) AS $range");
        }

        return $ageRangeExpressions;
    }
}
