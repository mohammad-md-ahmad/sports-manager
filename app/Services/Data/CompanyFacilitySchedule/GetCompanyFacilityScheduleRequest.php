<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyFacilitySchedule;

use App\Models\CompanyFacility;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class GetCompanyFacilityScheduleRequest extends Data
{
    public function __construct(
        #[MapInputName('facility_uuid')]
        #[WithCast(UuidToEntityCaster::class, CompanyFacility::class)]
        public string $facility_id,
        public ?string $date = null,
    ) {
    }
}
