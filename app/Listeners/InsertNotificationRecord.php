<?php

namespace App\Listeners;

use App\Models\Notification;
use App\Services\Data\Notification\CreateNotificationRequest;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InsertNotificationRecord
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(object $event): void
    {
        $this->insertNotificationRecord($event->createNotificationRequest);
    }

    protected function insertNotificationRecord(CreateNotificationRequest $createNotificationRequest): bool
    {
        try {
            DB::transaction(function () use ($createNotificationRequest) {
                Notification::create($createNotificationRequest->toArray());
            });

            return true;
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            throw $exception;
        }
    }
}
