<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\BookingServiceInterface;
use App\Enums\BookingStatus;
use App\Enums\ScheduleDetailsStatus;
use App\Models\Booking;
use App\Models\ScheduleDetails;
use App\Services\Data\Booking\ApproveBookingRequest;
use App\Services\Data\Booking\CreateBookingRequest;
use App\Services\Data\Booking\DeclineBookingRequest;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use LogicException;

class BookingService implements BookingServiceInterface
{
    /**
     * @throws Exception
     */
    public function store(CreateBookingRequest $data): Booking
    {
        try {
            /** @var ScheduleDetails $scheduleDetails */
            $scheduleDetails = ScheduleDetails::findOrFail($data->schedule_details_id);

            if (! $scheduleDetails->status->isBookable()) {
                throw new LogicException(__('Slot is not available for booking!'));
            }

            DB::beginTransaction();

            /** @var Booking $booking */
            $booking = Booking::create($data->toArray());

            $scheduleDetails->update(['status' => ScheduleDetailsStatus::Pending->name]);

            DB::commit();

            return $booking;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('BookingService::store: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function approve(ApproveBookingRequest $data): bool
    {
        try {
            /** @var Booking $booking */
            $booking = Booking::findOrFail($data->id);

            if (! $booking->status->isBookable() || $booking->scheduleDetails->status->isBooked()) {
                throw new LogicException(__('Slot is already booked or not available for booking!'));
            }

            DB::beginTransaction();

            $booking->update([
                'status' => BookingStatus::Approved->name,
            ]);

            // other booking requests should be declined
            $booking->scheduleDetails->bookings->except($booking->id)->each(function (Booking $booking) {
                $booking->update([
                    'status' => BookingStatus::Declined->name,
                ]);
            });

            $booking->scheduleDetails->update([
                'status' => ScheduleDetailsStatus::Booked->name,
            ]);

            DB::commit();

            return true;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('BookingService::approve: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function decline(DeclineBookingRequest $data): bool
    {
        try {
            /** @var Booking $booking */
            $booking = Booking::findOrFail($data->id);

            if (! $booking->status->isDeclinable() || ! $booking->scheduleDetails->status->isDeclinable()) {
                throw new LogicException(__('Booking is already approved or can\'t be declined!'));
            }

            DB::beginTransaction();

            $booking->update([
                'status' => BookingStatus::Declined->name,
            ]);

            // if there are no other booking requests, the status should be Available, otherwise => Pending
            $booking->scheduleDetails->update([
                'status' => $booking->scheduleDetails->bookings->count() > 0 ? ScheduleDetailsStatus::Pending->name : ScheduleDetailsStatus::Available->name,
            ]);

            DB::commit();

            return true;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('BookingService::approve: '.$exception->getMessage());

            throw $exception;
        }
    }
}
