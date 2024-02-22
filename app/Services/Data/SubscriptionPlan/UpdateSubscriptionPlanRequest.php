<?php

declare(strict_types=1);

namespace App\Services\Data\SubscriptionPlan;

use App\Models\Currency;
use App\Models\SubscriptionPlan;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class UpdateSubscriptionPlanRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, SubscriptionPlan::class)]
        public ?string $id = null,
        public ?string $name = null,
        public ?string $description = null,
        public ?string $type = null,
        public ?float $price = null,
        #[MapInputName('currency_uuid')]
        #[WithCast(UuidToEntityCaster::class, Currency::class)]
        public ?string $currency_id = null,
        public ?bool $is_enabled = true,
    ) {
    }

    public static function rules(): array
    {
        return [
            'type' => ['nullable', 'string', 'in:'.implode(',', array_column(SubscriptionPlan::cases(), 'name'))],
        ];
    }
}
