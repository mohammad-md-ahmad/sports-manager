<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyFacilitySchedule;

use App\Models\CompanyFacility;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

class GetCompanyFacilityScheduleRequest extends Data
{
    public function __construct(
        #[MapInputName('facility')]
        public CompanyFacility $facility,
        public ?string $date = null,
    ) {
    }
}
