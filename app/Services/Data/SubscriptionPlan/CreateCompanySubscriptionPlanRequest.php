<?php

declare(strict_types=1);

namespace App\Services\Data\SubscriptionPlan;

use App\Models\Company;
use App\Models\Currency;
use App\Models\SubscriptionPlan;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class CreateCompanySubscriptionPlanRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('company')]
        public Company $company,
        #[MapInputName('subscription_plan_uuid')]
        #[WithCast(UuidToEntityCaster::class, SubscriptionPlan::class)]
        public string $subscription_plan_id,
        public string $decimal_price,
        #[MapInputName('currency_uuid')]
        #[WithCast(UuidToEntityCaster::class, Currency::class)]
        public string $currency_id,
        public string $effective_from,
        public string $effective_to,
    ) {
    }
}
