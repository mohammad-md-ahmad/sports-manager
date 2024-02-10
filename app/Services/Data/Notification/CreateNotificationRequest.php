<?php

namespace App\Services\Data\Notification;

use Spatie\LaravelData\Data;

class CreateNotificationRequest extends Data
{
    public function __construct(
        public string $receiver_type,
        public string $receiver_id,
        public string $title,
        public string $notification,
        public string $status,
        public string $category,
    ) {
    }
}
