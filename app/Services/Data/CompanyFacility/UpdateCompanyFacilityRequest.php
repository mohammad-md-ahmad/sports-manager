<?php

declare(strict_types=1);

namespace App\Services\Data\CompanyFacility;

use App\Enums\FacilityType;
use App\Models\CompanyFacility;
use App\Models\Sport;
use App\Services\Data\Address\UpdateOrCreateAddressRequest;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class UpdateCompanyFacilityRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('facility')]
        public CompanyFacility $facility,
        public ?string $name = null,
        public string|FacilityType|null $type = null,
        public ?array $details = null,
        #[MapInputName('sport_uuid')]
        #[WithCast(UuidToEntityCaster::class, Sport::class)]
        public ?string $sport_id = null,
        public ?string $status = null,
        public ?UpdateOrCreateAddressRequest $address = null,
        public ?array $companyFacilityPhotos = null,
    ) {
    }
}
