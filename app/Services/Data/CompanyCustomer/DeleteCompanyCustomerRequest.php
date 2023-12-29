<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyCustomer;

use App\Models\CompanyCustomer;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

class DeleteCompanyCustomerRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('companyCustomer')]
        public CompanyCustomer $companyCustomer,
    ) {
    }
}
