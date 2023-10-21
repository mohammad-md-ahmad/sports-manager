<?php

declare(strict_types=1);

namespace App\Services\Data\Register;

use App\Services\Data\Address\CreateAddressRequest;
use App\Services\Data\User\CreateUserRequest;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class RegisterCompanyRequest extends Data
{
    public function __construct(
        public string $name,
        public string|Optional $description,
        public string|Optional $logo,
        public CreateAddressRequest|Optional $createAddressRequest,
        public CreateUserRequest|Optional $createUserRequest,
    ) {
    }
}
