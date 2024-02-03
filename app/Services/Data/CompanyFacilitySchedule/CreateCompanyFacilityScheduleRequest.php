<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyFacilitySchedule;

use App\Models\CompanyFacility;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

class CreateCompanyFacilityScheduleRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('facility')]
        public CompanyFacility $company_facility,
        public string $date_time_from,
        public string $date_time_to,
        public float $price,
    ) {
    }
}
