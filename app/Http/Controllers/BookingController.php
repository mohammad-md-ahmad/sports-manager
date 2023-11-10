<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\BookingServiceInterface;
use App\Services\Data\Booking\CreateBookingRequest;
use App\Services\Data\User\DeleteUserRequest;
use App\Services\Data\User\GetUserRequest;
use App\Services\Data\User\UpdateUserRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use LogicException;

class BookingController extends Controller
{
    public function __construct(
        protected BookingServiceInterface $bookingService
    ) {
    }

    //    public function get(GetUserRequest $request): JsonResponse
    //    {
    //        try {
    //            $data = $this->bookingService->get($request);
    //
    //            return response()->json([
    //                'message' => __('User has been retrieved successfully.'),
    //                'data' => $data->toArray(),
    //            ], Response::HTTP_OK);
    //        } catch (Exception $exception) {
    //            Log::error('Unable to retrieve user: '.$exception->getMessage());
    //
    //            return response()->json(['message' => __('Failed to retrieve User.')], Response::HTTP_BAD_REQUEST);
    //        }
    //    }

    /**
     * @throws Exception
     */
    public function store(CreateBookingRequest $request): JsonResponse
    {
        try {

            $data = $this->bookingService->store($request);

            return response()->json([
                'message' => __('Booking has been created successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (LogicException $exception) {
            Log::error('Unable to store Booking: '.$exception->getMessage());

            return response()->json(['message' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (Exception $exception) {
            Log::error('Unable to store Booking: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to complete Booking.')], Response::HTTP_BAD_REQUEST);
        }
    }

    //    public function update(UpdateUserRequest $request): JsonResponse
    //    {
    //        try {
    //            $user = $this->userService->update($request);
    //
    //            return response()->json([
    //                'message' => __('User has been updated successfully.'),
    //                'data' => $user,
    //            ], Response::HTTP_OK);
    //        } catch (Exception $exception) {
    //            Log::error('Unable to update user: '.$exception->getMessage());
    //
    //            return response()->json(['message' => __('Failed to update user.')], Response::HTTP_BAD_REQUEST);
    //        }
    //    }
    //
    //    public function delete(DeleteUserRequest $request): JsonResponse
    //    {
    //        try {
    //            $this->userService->delete($request);
    //
    //            return response()->json([
    //                'message' => __('User has been deleted successfully.'),
    //            ], Response::HTTP_OK);
    //        } catch (Exception $exception) {
    //            Log::error('Unable to delete user: '.$exception->getMessage());
    //
    //            return response()->json(['message' => __('Failed to delete user.')], Response::HTTP_BAD_REQUEST);
    //        }
    //    }
}
