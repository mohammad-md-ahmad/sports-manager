<?php

namespace App\Services;

use App\Services\Integrations\OneSignal\OneSignalRepository;
use Exception;
use Illuminate\Support\Facades\Log;

class PushNotificationService
{
    public function __construct(
        protected OneSignalRepository $oneSignalRepository,
    ) {
    }

    /**
     * @throws Exception
     */
    public function createNotification(array $user_uuids, string $message): bool
    {
        try {
            Log::info(print_r($user_uuids, true));
            Log::info($message);

            $data['user_uuids'] = $user_uuids;
            $data['message'] = $message;

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
