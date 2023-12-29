<?php

namespace App\Http\Controllers;

use App\Contracts\Services\NotificationServiceInterface;
use App\Services\Data\Notification\GetUserNotificationsRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    public function __construct(
        protected NotificationServiceInterface $notificationService
    ) {
    }

    public function getUserNotifications(GetUserNotificationsRequest $request): JsonResponse
    {
        try {
            $data = $this->notificationService->getUserNotifications($request);

            return response()->json([
                'message' => __('Notifications have been retrieved successfully.'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to retrieve Notifications: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to retrieve Notifications.')], Response::HTTP_BAD_REQUEST);
        }
    }
}
