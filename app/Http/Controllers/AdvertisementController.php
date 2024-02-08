<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\AdvertisementServiceInterface;
use App\Services\Data\Advertisement\GetAllAdvertisementsRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class AdvertisementController extends Controller
{
    public function __construct(
        protected AdvertisementServiceInterface $advertisementService
    ) {
    }

    public function getAll(GetAllAdvertisementsRequest $request): JsonResponse
    {
        try {
            $data = $this->advertisementService->getAll($request);

            return response()->json([
                'message' => __('Adverstisements has been retrieved successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to retrieve Adverstisements!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
