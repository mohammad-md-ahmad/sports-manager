<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\AdvertisementServiceInterface;
use App\Services\Data\Advertisement\CreateAdvertisementRequest;
use App\Services\Data\Advertisement\DeleteAdvertisementRequest;
use App\Services\Data\Advertisement\GetAdvertisementsRequest;
use App\Services\Data\Advertisement\GetAllAdvertisementsRequest;
use App\Services\Data\Advertisement\UpdateAdvertisementRequest;
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

    public function get(GetAdvertisementsRequest $request): JsonResponse
    {
        try {
            $data = $this->advertisementService->get($request);

            return response()->json([
                'message' => __('Adverstisement has been retrieved successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to retrieve Adverstisement!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function store(CreateAdvertisementRequest $request): JsonResponse
    {
        try {
            $data = $this->advertisementService->store($request);

            return response()->json([
                'message' => __('Adverstisement has been created successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to store Adverstisement: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to create Adverstisement.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function update(UpdateAdvertisementRequest $request): JsonResponse
    {
        try {
            $data = $this->advertisementService->update($request);

            return response()->json([
                'message' => __('Adverstisement has been updated successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to updated Adverstisement: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to updated Adverstisement.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function delete(DeleteAdvertisementRequest $request): JsonResponse
    {
        try {
            $this->advertisementService->delete($request);

            return response()->json([
                'message' => __('Adverstisement has been deleted successfully.'),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to delete Adverstisement: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to delete Adverstisement.')], Response::HTTP_BAD_REQUEST);
        }
    }
}
