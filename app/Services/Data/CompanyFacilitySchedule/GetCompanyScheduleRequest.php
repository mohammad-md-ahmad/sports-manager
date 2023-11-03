<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyFacilitySchedule;

use App\Models\Company;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class GetCompanyScheduleRequest extends Data
{
    public function __construct(
        #[MapInputName('company_uuid')]
        #[WithCast(UuidToEntityCaster::class, Company::class)]
        public string $company_id,
        public ?string $date = null,
    ) {
    }
}
