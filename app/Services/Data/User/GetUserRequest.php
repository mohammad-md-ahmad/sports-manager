<?php

declare(strict_types=1);

namespace App\Services\Data\User;

use App\Models\User;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class GetUserRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('uuid')]
        #[WithCast(UuidToEntityCaster::class, User::class)]
        public string $id,
    ) {
    }
}
