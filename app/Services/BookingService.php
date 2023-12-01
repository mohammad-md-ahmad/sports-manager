<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\BookingServiceInterface;
use App\Enums\BookingStatus;
use App\Enums\ScheduleDetailsStatus;
use App\Models\Booking;
use App\Models\ScheduleDetails;
use App\Models\User;
use App\Services\Data\Booking\ApproveBookingRequest;
use App\Services\Data\Booking\CreateBookingRequest;
use App\Services\Data\Booking\DeclineBookingRequest;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use LogicException;

class BookingService implements BookingServiceInterface
{
    public function __construct(
        protected PushNotificationService $pushNotificationService,
    ) {
    }

    /**
     * @throws Exception
     */
    public function store(CreateBookingRequest $data): Booking
    {
        try {
            /** @var User $user */
            $user = auth()->user();

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

            $this->pushNotificationService->createNotification(
                [$scheduleDetails->facility->company->companyUser()->user->uuid],
                __('User :user wants to book your facility :facility_name on :date', [
                    'user' => $user->full_name,
                    'facility_name' => $scheduleDetails->facility->name,
                    'date' => $scheduleDetails->date_time_from,
                ])
            );

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
            /** @var User $user */
            $user = auth()->user();

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

            $this->pushNotificationService->createNotification(
                [$user->uuid],
                __('Your booking request of facility :facility_name on :date has been approved', [
                    'facility_name' => $booking->scheduleDetails->facility->name,
                    'date' => $booking->scheduleDetails->date_time_from,
                ])
            );

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
            /** @var User $user */
            $user = auth()->user();

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
                'status' => $booking->scheduleDetails->bookings->where('status', BookingStatus::Pending->name)->count() > 0 ? ScheduleDetailsStatus::Pending->name : ScheduleDetailsStatus::Available->name,
            ]);

            DB::commit();

            $this->pushNotificationService->createNotification(
                [$user->uuid],
                __('Your booking request of facility :facility_name on :date has been declined', [
                    'facility_name' => $booking->scheduleDetails->facility->name,
                    'date' => $booking->scheduleDetails->date_time_from,
                ])
            );

            return true;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('BookingService::approve: '.$exception->getMessage());

            throw $exception;
        }
    }
}
