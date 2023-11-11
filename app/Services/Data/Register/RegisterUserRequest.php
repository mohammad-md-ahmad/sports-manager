<?php

declare(strict_types=1);

namespace App\Services\Data\Register;

use App\Enums\UserType;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class RegisterUserRequest extends Data
{
    public function __construct(
        public string $first_name,
        public string $last_name,
        #[Unique('users', 'username')]
        public string $username,
        #[Email]
        public string $email,
        public string $password,
        public string|Optional $profile_picture,
        public string|Optional|null $type = null,
    ) {
        $this->type = UserType::CUSTOMER_USER->name;
    }
}
