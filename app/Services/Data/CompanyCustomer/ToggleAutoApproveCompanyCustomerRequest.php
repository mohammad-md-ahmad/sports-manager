<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyCustomer;

use App\Models\CompanyCustomer;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class ToggleAutoApproveCompanyCustomerRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, CompanyCustomer::class)]
        public string $id,
    ) {
    }
}
