<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\RatingServiceInterface;
use App\Services\Data\Rating\CreateRatingRequest;
use App\Services\Data\Rating\GetEntityRatingsRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use LogicException;

class RatingController extends Controller
{
    public function __construct(
        protected RatingServiceInterface $ratingService
    ) {
    }

    public function store(CreateRatingRequest $request): JsonResponse
    {
        try {
            $data = $this->ratingService->store($request);

            return response()->json([
                'message' => __('Rating has been created successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (LogicException $exception) {
            Log::error('Unable to store Rating: '.$exception->getMessage());

            return response()->json(['message' => $exception->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (Exception $exception) {
            Log::error('Unable to store Rating: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to complete Rating.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getEntityRatings(GetEntityRatingsRequest $request): JsonResponse
    {
        try {
            $data = $this->ratingService->getEntityRatings($request);

            return response()->json([
                'message' => __('Ratings have been retrieved successfully.'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to retrieve Ratings: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to retrieve Ratings.')], Response::HTTP_BAD_REQUEST);
        }
    }
}
