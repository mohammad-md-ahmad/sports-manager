<?php

namespace App\Services\Data\CompanyCustomer;

use App\Models\Company;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

class GetCompanyCustomersRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('company')]
        public Company $company,
    ) {
    }
}
