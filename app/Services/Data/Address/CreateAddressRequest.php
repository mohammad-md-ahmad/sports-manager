<?php

declare(strict_types=1);

namespace App\Services\Data\Address;

use App\Models\Country;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class CreateAddressRequest extends Data
{
    public function __construct(
        public string|Optional $model_type,
        public string|Optional $model_id,
        public string $line_1,
        public string|Optional $line_2,
        public string|Optional $line_3,
        public string|Optional $city,
        public string|Optional $region,
        public string|Optional $postcode,
        public array $geocode_data,
        #[MapInputName('country_uuid')]
        #[WithCast(UuidToEntityCaster::class, Country::class)]
        public string $country_id,
    ) {
    }
}
