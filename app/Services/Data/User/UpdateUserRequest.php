<?php

declare(strict_types=1);

namespace App\Services\Data\User;

use App\Models\User;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateUserRequest extends Data
{
    public function __construct(
        #[MapInputName('uuid')]
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, User::class)]
        public string $id,
        public string|Optional $first_name,
        public string|Optional $last_name,
        #[Email]
        public string|Optional $email,
        public string|Optional $type,
    ) {
    }
}
