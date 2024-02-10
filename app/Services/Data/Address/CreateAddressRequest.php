<?php

declare(strict_types=1);

namespace App\Services\Data\Address;

use App\Models\Country;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class CreateAddressRequest extends Data
{
    public function __construct(
        public string $line_1,
        public string $city,
        #[MapInputName('country_uuid')]
        #[WithCast(UuidToEntityCaster::class, Country::class)]
        public string $country_id,
        public ?string $line_2 = null,
        public ?string $line_3 = null,
        public ?string $region = null,
        public ?string $postcode = null,
        public ?array $geocode_data = null,
        public ?string $model_type = null,
        public ?string $model_id = null,
    ) {
    }
}
