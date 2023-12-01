<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\PushNotificationService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class PushNotificationController extends Controller
{
    public function __construct(
        protected PushNotificationService $pushNotificationService,
    ) {
    }

    public function sendNotification(Request $request): JsonResponse
    {
        try {
            $this->pushNotificationService->createNotification([
                $request->get('user_uuid'),
            ], $request->get('message'));

            return response()->json([
                'message' => __('Notification has been retrieved successfully.'),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to send Notification: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to send Notification.')], Response::HTTP_BAD_REQUEST);
        }
    }
}
