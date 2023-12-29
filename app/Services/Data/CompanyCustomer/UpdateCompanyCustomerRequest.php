<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyCustomer;

use App\Enums\CompanyCustomerStatus;
use App\Models\CompanyCustomer;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

class UpdateCompanyCustomerRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('companyCustomer')]
        public CompanyCustomer $companyCustomer,
        public string|CompanyCustomerStatus|null $status = null,
        public ?array $settings = [],
        public ?bool $is_member = false,
    ) {
    }
}
