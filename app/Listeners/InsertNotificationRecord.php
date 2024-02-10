<?php

namespace App\Listeners;

use App\Models\Booking;
use App\Models\BookingNotification;
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
        $this->insertNotificationRecord($event->createNotificationRequest, $event->booking);
    }

    protected function insertNotificationRecord(CreateNotificationRequest $createNotificationRequest, Booking $booking): bool
    {
        try {
            DB::transaction(function () use ($createNotificationRequest, $booking) {
                $notification = Notification::create($createNotificationRequest->toArray());

                BookingNotification::updateOrCreate([
                    'booking_id' => $booking->id,
                    'notification_id' => $notification->id,
                ]);
            });

            return true;
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            throw $exception;
        }
    }
}
