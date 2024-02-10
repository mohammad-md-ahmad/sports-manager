<?php

namespace App\Events;

use App\Models\Booking;
use App\Services\Data\Notification\CreateNotificationRequest;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookingEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public Booking $booking,
        public CreateNotificationRequest $createNotificationRequest,
    ) {
    }
}
