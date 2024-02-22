<?php

declare(strict_types=1);

namespace App\Services\Data\SubscriptionPlan;

use App\Models\Currency;
use App\Models\SubscriptionPlan;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class CreateSubscriptionPlanRequest extends Data
{
    public function __construct(
        #[Unique('subscription_plans')]
        public string $name,
        public string $description,
        public string $type,
        public float $price,
        #[MapInputName('currency_uuid')]
        #[WithCast(UuidToEntityCaster::class, Currency::class)]
        public string $currency_id,
        public bool $is_enabled,
    ) {
    }

    public static function rules(): array
    {
        return [
            'type' => ['required', 'string', 'in:'.implode(',', array_column(SubscriptionPlan::cases(), 'name'))],
        ];
    }
}
