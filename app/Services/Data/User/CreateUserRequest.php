<?php

declare(strict_types=1);

namespace App\Services\Data\User;

use Illuminate\Validation\Rules\Password;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class CreateUserRequest extends Data
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
        public ?string $type = null,
        public ?string $gender = '',
        public ?string $dob = '',
        public ?array $favorite_sports = [],
    ) {
    }

    public static function rules(): array
    {
        return [
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->numbers()
                    ->symbols()
                    ->uncompromised(),
            ],
            'password_confirmation' => ['required'],
        ];
    }
}
