<?php

namespace App\Contracts\Services;

use App\Models\Booking;
use App\Models\User;
use App\Services\Data\Booking\ApproveBookingRequest;
use App\Services\Data\Booking\CreateBookingRequest;
use App\Services\Data\Booking\DeclineBookingRequest;
use App\Services\Data\Booking\GetBookingsRequest;
use App\Services\Data\User\DeleteUserRequest;
use App\Services\Data\User\GetUserRequest;
use App\Services\Data\User\UpdateUserRequest;
use Illuminate\Pagination\LengthAwarePaginator;

interface BookingServiceInterface
{
    //    public function get(GetUserRequest $data): User;
    public function getAll(GetBookingsRequest $data): LengthAwarePaginator;

    public function store(CreateBookingRequest $data): Booking;

    //    public function update(UpdateUserRequest $data): User;
    //
    //    public function delete(DeleteUserRequest $data): bool;
    public function approve(ApproveBookingRequest $data): bool;

    public function decline(DeclineBookingRequest $data): bool;
}
