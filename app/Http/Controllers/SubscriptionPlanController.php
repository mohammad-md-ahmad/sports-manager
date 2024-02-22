<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\SubscriptionPlanServiceInterface;
use App\Services\Data\SubscriptionPlan\UpdateSubscriptionPlanRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class SubscriptionPlanController extends Controller
{
    public function __construct(
        protected SubscriptionPlanServiceInterface $subscriptionPlanService
    ) {
    }

    public function getAll(Request $request): JsonResponse
    {
        try {
            $data = $this->subscriptionPlanService->getAll($request);

            return response()->json([
                'message' => __('Subscription Plans has been retrieved successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to retrieve Subscription Plan!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function update(UpdateSubscriptionPlanRequest $request): JsonResponse
    {
        try {
            $data = $this->subscriptionPlanService->update($request);

            return response()->json([
                'message' => __('Subscription Plan has been updated successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to update Subscription Plan!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
