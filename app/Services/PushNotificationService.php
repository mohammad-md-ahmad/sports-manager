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
    public function createNotification(): bool
    {
        try {
            $this->oneSignalRepository->createNotification();

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
