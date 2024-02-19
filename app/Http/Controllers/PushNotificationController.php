<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\Data\PushNotification\SendPushNotificationRequest;
use App\Services\PushNotificationService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class PushNotificationController extends Controller
{
    public function __construct(
        protected PushNotificationService $pushNotificationService,
    ) {
    }

    public function sendPushNotification(SendPushNotificationRequest $request): JsonResponse
    {
        try {
            $this->pushNotificationService->sendPushNotification($request);

            return response()->json([
                'message' => __('Notification has been sent successfully.'),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to send Notification: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to send Notification.')], Response::HTTP_BAD_REQUEST);
        }
    }
}
