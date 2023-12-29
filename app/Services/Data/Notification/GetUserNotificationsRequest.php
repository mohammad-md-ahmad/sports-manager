<?php

namespace App\Services\Data\Notification;

use App\Models\User;
use App\Services\Data\Core\UuidToEntityCaster;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class GetUserNotificationsRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('user_uuid')]
        #[WithCast(UuidToEntityCaster::class, User::class)]
        public string $id,
    ) {
    }
}
