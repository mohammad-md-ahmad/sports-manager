<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyFacility;

use App\Models\Address;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateCompanyFacilityRequest extends Data
{
    public function __construct(
        //        #[MapInputName('uuid')]
        //        #[FromRouteParameter('uuid')]
        //        #[WithCast(UuidToEntityCaster::class, Address::class)]
        //        public string $id,
        //        public string|Optional $model_type,
        //        public string|Optional $model_id,
        //        public string|Optional $line_1,
        //        public string|Optional $line_2,
        //        public string|Optional $line_3,
        //        public string|Optional $city,
        //        public string|Optional $region,
        //        public string|Optional $postcode,
        //        public array|Optional $geocode_data,
        //        #[MapInputName('country_uuid')]
        //        #[WithCast(UuidToEntityCaster::class, Country::class)]
        //        public string|Optional $country_id,
    ) {
    }
}
