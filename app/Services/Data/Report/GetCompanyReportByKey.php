<?php

declare(strict_types=1);

namespace App\Services\Data\Report;

use App\Models\Company;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

class GetCompanyReportByKey extends Data
{
    public function __construct(
        #[FromRouteParameter('company')]
        public Company $company,
        public string $key,
    ) {
    }
}
