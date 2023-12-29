<?php

namespace App\Contracts\Services;

use App\Services\Data\Notification\GetUserNotificationsRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface NotificationServiceInterface
{
    public function getUserNotifications(GetUserNotificationsRequest $data): LengthAwarePaginator;
}
