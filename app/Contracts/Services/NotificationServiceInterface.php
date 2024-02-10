<?php

namespace App\Contracts\Services;

use App\Services\Data\Notification\GetReceiverNotificationsRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface NotificationServiceInterface
{
    public function getUserNotifications(GetReceiverNotificationsRequest $data): LengthAwarePaginator;
}
