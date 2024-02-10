<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\NotificationServiceInterface;
use App\Models\Company;
use App\Models\User;
use App\Services\Data\Notification\GetReceiverNotificationsRequest;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use LogicException;

class NotificationService implements NotificationServiceInterface
{
    public function getUserNotifications(GetReceiverNotificationsRequest $data): LengthAwarePaginator
    {
        try {
            if ($data->receiver_type === 'user') {
                /** @var User $receiver */
                $receiver = User::query()->whereUuid($data->receiver_uuid)->first();
            } else {
                /** @var Company $receiver */
                $receiver = Company::query()->whereUuid($data->receiver_uuid)->first();
            }

            if (! $receiver) {
                throw new LogicException(__('Receiver not found!'));
            }

            return $receiver->notifications()->with(['bookingNotifications.booking', 'bookingNotifications.notification'])->jsonPaginate();
        } catch (Exception $exception) {
            Log::error('NotificationService::getUserNotifications: '.$exception->getMessage());

            throw $exception;
        }
    }
}
