<?php

declare(strict_types=1);

namespace App\Services\Data\SubscriptionPlan;

use App\Models\SubscriptionPlan;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class GetSubscriptionPlanRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, SubscriptionPlan::class)]
        public string $id,
    ) {
    }
}
