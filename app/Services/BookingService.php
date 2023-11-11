<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\BookingServiceInterface;
use App\Enums\ScheduleDetailsStatus;
use App\Models\Booking;
use App\Models\ScheduleDetails;
use App\Models\User;
use App\Services\Data\Booking\CreateBookingRequest;
use App\Services\Data\User\DeleteUserRequest;
use App\Services\Data\User\GetUserRequest;
use App\Services\Data\User\UpdateUserRequest;
use App\Traits\ImageUpload;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use LogicException;

class BookingService implements BookingServiceInterface
{
    //    use ImageUpload;
    //
    //    public function get(GetUserRequest $data): User
    //    {
    //        try {
    //            /** @var User $user */
    //            $user = User::findOrFail($data->id);
    //
    //            return $user;
    //        } catch (Exception $exception) {
    //            Log::error('UserService::get: '.$exception->getMessage());
    //
    //            throw $exception;
    //        }
    //    }

    /**
     * @throws Exception
     */
    public function store(CreateBookingRequest $data): Booking
    {
        try {
            /** @var ScheduleDetails $scheduleDetails */
            $scheduleDetails = ScheduleDetails::findOrFail($data->schedule_details_id);

            if ($scheduleDetails->status !== ScheduleDetailsStatus::Available) {
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

    //    public function update(UpdateUserRequest $data): User
    //    {
    //        $uploadedImg = null;
    //
    //        try {
    //            $userId = $data->id ?? $data->id_from_route;
    //
    //            if (! $userId) {
    //                throw ValidationException::withMessages(['id' => __('id is required.')]);
    //            }
    //
    //            /** @var User $user */
    //            $user = User::findOrFail($userId);
    //
    //            DB::beginTransaction();
    //
    //            $user->update($data->toArray());
    //
    //            // after company got updated successfully, upload and update the logo
    //            if ($data->profile_picture && is_string($data->profile_picture)) {
    //                $uploadedImg = $this->uploadImage($data->profile_picture, $user->id);
    //                $user->profile_picture = $uploadedImg;
    //                $user->save();
    //            }
    //
    //            DB::commit();
    //
    //            return $user;
    //        } catch (Exception $exception) {
    //            DB::rollBack();
    //
    //            if ($uploadedImg) {
    //                $this->deleteImage($uploadedImg);
    //            }
    //
    //            Log::error('UserService::update: '.$exception->getMessage());
    //
    //            throw $exception;
    //        }
    //    }
    //
    //    public function delete(DeleteUserRequest $data): bool
    //    {
    //        try {
    //            return User::findOrFail($data->id)->delete();
    //        } catch (Exception $exception) {
    //            Log::error('UserService::delete: '.$exception->getMessage());
    //
    //            throw $exception;
    //        }
    //    }
    //
    //    /**
    //     * @throws Exception
    //     */
    //    private function uploadImage(string $image, int|string $id = null): string
    //    {
    //        try {
    //            do {
    //                $imageData = $this->base64Decode($image);
    //                $path = $this->base64ToImage($image, 'user-profile-pictures', $imageData);
    //            } while (! Storage::disk('public')->put($path, $imageData));
    //
    //            // delete the old logo
    //            if ($id) {
    //                /** @var User $user */
    //                $user = User::findOrFail($id);
    //
    //                if ($user->profile_picture) {
    //                    $this->deleteImage($user->profile_picture);
    //                }
    //            }
    //
    //            return $path;
    //        } catch (Exception $exception) {
    //            Log::error('Uploading user profile picture: '.$exception->getMessage());
    //
    //            throw $exception;
    //        }
    //    }
    //
    //    private function deleteImage(string $image): bool
    //    {
    //        try {
    //            return Storage::disk('public')->delete($image);
    //        } catch (Exception $exception) {
    //            Log::error('Delete user profile picture: '.$exception->getMessage());
    //
    //            throw $exception;
    //        }
    //    }
}
