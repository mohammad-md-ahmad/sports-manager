<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyFacility;

use App\Models\CompanyFacility;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class GetCompanyFacilityRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, CompanyFacility::class)]
        public string $id,
    ) {
    }
}
