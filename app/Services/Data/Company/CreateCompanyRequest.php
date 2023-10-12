<?php

declare(strict_types=1);

namespace App\Services\Data\Company;

use App\Services\Data\Address\CreateAddressRequest;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class CreateCompanyRequest extends Data
{
    public function __construct(
        #[Unique('companies', ['name', 'address_id'])]
        public string $name,
        #[Unique('companies', ['name_ar', 'address_id'])]
        public string|Optional $name_ar,
        public string|Optional $description,
        public string|Optional $logo,
        public CreateAddressRequest $createAddressRequest,
    ) {
    }
}
