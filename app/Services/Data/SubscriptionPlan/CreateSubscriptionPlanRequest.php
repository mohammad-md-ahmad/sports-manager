<?php

declare(strict_types=1);

namespace App\Services\Data\SubscriptionPlan;

use App\Models\Currency;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class CreateSubscriptionPlanRequest extends Data
{
    public function __construct(
        public string $name,
        public string $description,
        public float $price,
        #[MapInputName('currency_uuid')]
        #[WithCast(UuidToEntityCaster::class, Currency::class)]
        public string $currency_id,
        public bool $is_enabled,
    ) {
    }
}
