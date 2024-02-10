<?php

declare(strict_types=1);

namespace App\Services\Data\Address;

use Spatie\LaravelData\Data;

class updateOrCreateAddressRequest extends Data
{
    public function __construct(
        public ?string $uuid = null,
        public ?string $model_type = null,
        public ?string $model_id = null,
        public ?string $line_1 = null,
        public ?string $line_2 = null,
        public ?string $line_3 = null,
        public ?string $city = null,
        public ?string $region = null,
        public ?string $postcode = null,
        public ?array $geocode_data = null,
        public ?string $country_uuid = null,
    ) {
    }
}
