<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyFacility;

use App\Models\Company;
use App\Services\Data\Address\CreateAddressRequest;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

class CreateCompanyFacilityRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('company')]
        public Company $company,
        public string $name,
        public string $type,
        public array $details,
        public CreateAddressRequest $createAddressRequest,
    ) {
    }
}
