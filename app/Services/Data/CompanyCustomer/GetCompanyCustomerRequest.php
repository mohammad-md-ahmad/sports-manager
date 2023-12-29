<?php

namespace App\Services\Data\CompanyCustomer;

use App\Models\CompanyCustomer;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

class GetCompanyCustomerRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('companyCustomer')]
        public CompanyCustomer $companyCustomer,
    ) {
    }
}
