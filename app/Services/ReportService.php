<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Formatters\Money\DecimalMoneyFormatterInterface;
use App\Contracts\Services\ReportServiceInterface;
use App\Enums\BookingStatus;
use App\Enums\Report;
use App\Enums\UserType;
use App\Models\Booking;
use App\Models\Company;
use App\Models\User;
use App\Services\Data\Report\GetReportByKey;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Money\Currency;
use Money\Money;

class ReportService implements ReportServiceInterface
{
    protected Company $company;

    public function get(GetReportByKey $data): Collection
    {
        try {
            $this->company = $data->company;

            $data = match ($data->key) {
                Report::CustomerDemographics->name => $this->getCompanyCustomersDemograhpicsReport($data),
                Report::SystemMetrics->name => $this->getSystemMetrics(),
            };

            return $data;
        } catch (Exception $exception) {
            Log::error('ReportService::get: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function getSystemMetrics(): Collection
    {
        try {
            $results = [];

            $results['total_companies'] = Company::query()->get()->count();
            $results['total_customers'] = User::query()->where('type', UserType::CUSTOMER_USER->name)->get()->count();
            $results['total_booking_requests'] = Booking::query()->get()->count();

            return collect($results);
        } catch (Exception $exception) {
            Log::error('Report::getSystemMetrics: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function getCompanyCustomersDemograhpicsReport(GetReportByKey $data)
    {
        try {
            $genders = $this->getCompanyCustomersGenderDemograhpics($data->company);
            $ages = $this->getCompanyCustomersAgeDemographics($data->company);
            $usersPerMonth = $this->getCompanyCustomersCountPerMonth($data->company);
            $revenuePerYear = $this->getCompanyRevenuePerYear();

            if (isset($revenuePerYear->amount)) {
                $moneyAmount = new Money($revenuePerYear->amount, new Currency($this->company->currency->iso_short_code));
                $revenuePerYear->amount = app(DecimalMoneyFormatterInterface::class)->format($moneyAmount);
            }

            $revenuePerYear->currency = $this->company->currency->iso_short_code;

            $results = [
                'genders' => $genders,
                'ages' => $ages,
                'users_per_month' => $usersPerMonth,
                'revenue_per_year' => $revenuePerYear,
            ];

            return collect($results);
        } catch (Exception $exception) {
            Log::error('Report::getCompanyCustomersDemograhpicsReport: '.$exception->getMessage());

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
            'belowTwelve' => [0, 12],
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

        return $result->get()->first();
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

    protected function getCompanyCustomersCountPerMonth()
    {
        $customersQuery = DB::table('users', 'u');

        $customersQuery->select([
            DB::raw('COUNT(DISTINCT cc.id) AS count'),
            DB::raw('MONTH(cc.created_at) AS month'),
            DB::raw('YEAR(cc.created_at) AS year'),
        ])->join('companies AS c', function (Builder $query) {
            $query->where('c.id', $this->company->id);
        })->join('company_customers AS cc', function (Builder $query) {
            $query->on('cc.company_id', '=', 'c.id');
        })->groupBy(['year', 'month']);

        return $customersQuery->get();
    }

    public function getCompanyRevenuePerYear()
    {
        $currentDate = Carbon::now();

        $bookingQuery = DB::table('bookings')
            ->select([
                DB::raw('SUM(sd.price) AS amount'),
                DB::raw('MONTH(sd.date_time_from) AS month'),
                DB::raw('YEAR(sd.date_time_from) AS year'),
            ])
            ->join('schedule_details AS sd', 'bookings.schedule_details_id', '=', 'sd.id')
            ->join('schedules AS s', 'sd.schedule_id', '=', 's.id')
            ->join('company_facilities AS cf', 's.company_facility_id', '=', 'cf.id')
            ->join('companies AS c', 'cf.company_id', '=', 'c.id')
            ->where([
                ['bookings.status', '=', BookingStatus::Approved->name],
                ['c.id', '=', $this->company->id],
            ])
            ->whereDate('sd.date_time_to', '<', $currentDate)
            ->groupBy('year', 'month');

        return $bookingQuery->first();
    }
}
