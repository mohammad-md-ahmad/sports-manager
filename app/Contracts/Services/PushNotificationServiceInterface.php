<?php

namespace App\Contracts\Services;

use App\Services\Data\PushNotification\SendPushNotificationRequest;

interface PushNotificationServiceInterface
{
    public function sendPushNotification(SendPushNotificationRequest $data): bool;
}
