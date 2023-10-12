<?php

declare(strict_types=1);

namespace App\Services\Data\Company;

use App\Models\Company;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateCompanyRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, Company::class)]
        public string $id,
        #[Unique('companies', ['name', 'address_id'])]
        public string $name,
        #[Unique('companies', ['name_ar', 'address_id'])]
        public string|Optional $name_ar,
        public string|Optional $description,
        public string|Optional $logo,
    ) {
    }
}
