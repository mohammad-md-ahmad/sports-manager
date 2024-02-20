<?php

declare(strict_types=1);

namespace App\Services\Data\Company;

use App\Enums\CompanyStatus;
use App\Enums\FacilityType;
use App\Models\Country;
use App\Models\Sport;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class SearchCompaniesRequest extends Data
{
    public function __construct(
        public ?string $name = null,
        #[MapInputName('country_uuid')]
        #[WithCast(UuidToEntityCaster::class, Country::class)]
        public ?string $country_id = null,
        public ?string $city = null,
        public ?string $type = null,
        #[MapInputName('sport_uuid')]
        #[WithCast(UuidToEntityCaster::class, Sport::class)]
        public ?string $sport_id = null,
        public ?string $status = null,
    ) {
    }

    public static function rules(): array
    {
        return [
            'type' => ['nullable', 'string', 'in:'.implode(',', array_column(FacilityType::cases(), 'name'))],
            'status' => ['nullable', 'string', 'in:'.implode(',', array_column(CompanyStatus::cases(), 'name'))],
        ];
    }
}
