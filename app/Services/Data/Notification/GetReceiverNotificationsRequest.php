<?php

namespace App\Services\Data\Notification;

use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

class GetReceiverNotificationsRequest extends Data
{
    public function __construct(
        #[FromRouteParameter('receiver_uuid')]
        public string $receiver_uuid,
        public string $receiver_type,
    ) {
    }
}
