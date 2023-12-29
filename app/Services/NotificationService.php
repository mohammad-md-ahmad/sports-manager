<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\NotificationServiceInterface;
use App\Models\User;
use App\Services\Data\Notification\GetUserNotificationsRequest;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class NotificationService implements NotificationServiceInterface
{
    public function getUserNotifications(GetUserNotificationsRequest $data): LengthAwarePaginator
    {
        try {
            /** @var User $user */
            $user = User::findOrFail($data->id);

            return $user->notifications()->jsonPaginate();
        } catch (Exception $exception) {
            Log::error('NotificationService::getUserNotifications: '.$exception->getMessage());

            throw $exception;
        }
    }
}
