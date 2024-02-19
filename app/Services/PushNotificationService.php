<?php

namespace App\Services;

use App\Models\User;
use App\Services\Data\PushNotification\SendPushNotificationRequest;
use App\Services\Integrations\OneSignal\OneSignalRepository;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class PushNotificationService
{
    public function __construct(
        protected OneSignalRepository $oneSignalRepository,
    ) {
    }

    public function sendPushNotification(SendPushNotificationRequest $data)
    {
        try {
            $userUuids = [];

            if ($data->company_id) {
                $query = User::query()->whereHas('companyUser', function (Builder $query) use ($data) {
                    $query->whereHas('company', function (Builder $query) use ($data) {
                        $query->where('id', $data->company_id);
                    });
                });

                $userUuids = $query->get()->pluck('uuid')->toArray();
            } elseif ($data->user_id) {
                $userQuery = User::query();

                $userQuery->when($data->country_id, function (Builder $query) use ($data) {
                    $query->whereHas('address', function (Builder $query) use ($data) {
                        $query->where('country_id', $data->country_id);
                    });
                });

                $userQuery->where('id', $data->user_id);

                $userUuids = $userQuery->get()->pluck('uuid')->toArray();
            } elseif ($data->user_type) {
                $userQuery = User::query();

                $userQuery->when($data->country_id, function (Builder $query) use ($data) {
                    $query->whereHas('address', function (Builder $query) use ($data) {
                        $query->where('country_id', $data->country_id);
                    });
                });

                $userQuery->where('type', $data->user_type);

                $userUuids = $userQuery->get()->pluck('uuid')->toArray();
            }

            $this->createNotification(
                $userUuids,
                $data->message
            );

            return true;
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function createNotification(array $user_uuids, string $message, array $buttons = [], array $custom_data = []): bool
    {
        try {
            $data['user_uuids'] = $user_uuids;
            $data['message'] = $message;

            if ($buttons) {
                $data['buttons'] = $buttons;
            }

            if ($custom_data) {
                $data['custom_data'] = $custom_data;
            }

            $this->oneSignalRepository->createNotification($data);

            return true;
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function createUser(): bool
    {
        try {
            $this->oneSignalRepository->createUser();

            return true;
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            throw $exception;
        }
    }
}
