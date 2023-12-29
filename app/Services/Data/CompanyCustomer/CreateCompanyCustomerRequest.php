<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyCustomer;

use App\Enums\CompanyCustomerStatus;
use App\Models\Company;
use App\Models\User;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class CreateCompanyCustomerRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('company')]
        public Company $company,
        #[MapInputName('user_uuid')]
        #[WithCast(UuidToEntityCaster::class, User::class)]
        public string $user_id,
        public array $settings,
        public string|CompanyCustomerStatus|null $status = CompanyCustomerStatus::Active,
        public ?bool $is_member = false,
    ) {
    }
}
