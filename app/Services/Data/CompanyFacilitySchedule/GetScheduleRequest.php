<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyFacilitySchedule;

use App\Models\Company;
use App\Models\CompanyFacility;
use App\Models\User;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class GetScheduleRequest extends Data
{
    public function __construct(
        public string $year_month,
        #[MapInputName('company_uuid')]
        #[WithCast(UuidToEntityCaster::class, Company::class)]
        public ?string $company_id = null,
        #[MapInputName('facility_uuid')]
        #[WithCast(UuidToEntityCaster::class, CompanyFacility::class)]
        public ?string $facility_id = null,
        #[MapInputName('customer_user_uuid')]
        #[WithCast(UuidToEntityCaster::class, User::class)]
        public ?string $customer_user_id = null,
    ) {
    }
}
