<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyFacility;

use App\Enums\FacilityType;
use App\Models\Country;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class SearchCompanyFacilitiesRequest extends Data
{
    public function __construct(
        public ?string $name = null,
        #[MapInputName('country_uuid')]
        #[WithCast(UuidToEntityCaster::class, Country::class)]
        public ?string $country_id = null,
        public ?string $city = null,
        public ?string $type = null,
    ) {
    }

    public static function rules(): array
    {
        return [
            'type' => ['nullable', 'string', 'in:'.implode(',', array_column(FacilityType::cases(), 'name'))],
        ];
    }
}
