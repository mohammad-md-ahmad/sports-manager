<?php

declare(strict_types=1);

namespace App\Services\Data\CompanySurvey;

use App\Models\Company;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

class SendCompanyLatestSurveyRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('company')]
        public Company $company,
    ) {
    }
}
