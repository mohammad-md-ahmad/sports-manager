<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyFacilitySchedule;

use App\Models\Company;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

class GetCompanyScheduleRequest extends Data
{
    public function __construct(
        #[MapInputName('company')]
        public Company $company,
        public ?string $date = null,
    ) {
    }
}
