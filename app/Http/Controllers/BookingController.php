<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\BookingServiceInterface;
use App\Services\Data\Booking\ApproveBookingRequest;
use App\Services\Data\Booking\CreateBookingRequest;
use App\Services\Data\Booking\DeclineBookingRequest;
use App\Services\Data\Booking\GetBookingsRequest;
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

    public function getAll(GetBookingsRequest $request): JsonResponse
    {
        try {
            $data = $this->bookingService->getAll($request);

            return response()->json([
                'message' => __('Bookings has been retrieved successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to retrieve bookings!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

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

    public function approve(ApproveBookingRequest $request): JsonResponse
    {
        try {
            $this->bookingService->approve($request);

            return response()->json([
                'message' => __('Booking request has been approved successfully.'),
            ], Response::HTTP_OK);
        } catch (LogicException $exception) {
            Log::error('Unable to approve booking request: '.$exception->getMessage());

            return response()->json(['message' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (Exception $exception) {
            Log::error('Unable to approve booking request: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to approve booking request.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function decline(DeclineBookingRequest $request): JsonResponse
    {
        try {
            $this->bookingService->decline($request);

            return response()->json([
                'message' => __('Booking request has been declined successfully.'),
            ], Response::HTTP_OK);
        } catch (LogicException $exception) {
            Log::error('Unable to approve booking request: '.$exception->getMessage());

            return response()->json(['message' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (Exception $exception) {
            Log::error('Unable to decline booking request: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to decline booking request.')], Response::HTTP_BAD_REQUEST);
        }
    }
}
