<?php

declare(strict_types=1);

namespace App\Services\Data\Auth;

use Illuminate\Validation\Rules\Password;
use Spatie\LaravelData\Data;

class LoginRequest extends Data
{
    public function __construct(
        public string $username,
        public string $password,
    ) {
    }

    public static function rules(): array
    {
        return [
            'password' => [
                'required',
                Password::min(8),
            ],
        ];
    }
}
