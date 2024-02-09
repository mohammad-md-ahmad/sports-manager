<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\SportServiceInterface;
use App\Services\Data\Advertisement\DeleteAdvertisementRequest;
use App\Services\Data\Advertisement\GetAdvertisementsRequest;
use App\Services\Data\Sport\CreateSportRequest;
use App\Services\Data\Sport\GetAllSportsRequest;
use App\Services\Data\Sport\UpdateSportRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class SportController extends Controller
{
    public function __construct(
        protected SportServiceInterface $sportService
    ) {
    }

    public function getAll(GetAllSportsRequest $request): JsonResponse
    {
        try {
            $data = $this->sportService->getAll($request);

            return response()->json([
                'message' => __('Sports has been retrieved successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to retrieve Sports!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    //    public function get(GetAdvertisementsRequest $request): JsonResponse
    //    {
    //        try {
    //            $data = $this->advertisementService->get($request);
    //
    //            return response()->json([
    //                'message' => __('Adverstisement has been retrieved successfully!'),
    //                'data' => $data,
    //            ], Response::HTTP_OK);
    //        } catch (Exception $exception) {
    //            Log::error($exception->getMessage());
    //
    //            return response()->json([
    //                'message' => __('Unable to retrieve Adverstisement!'),
    //                'errors' => $exception->getMessage(),
    //            ], Response::HTTP_BAD_REQUEST);
    //        }
    //    }

    public function store(CreateSportRequest $request): JsonResponse
    {
        try {
            $data = $this->sportService->store($request);

            return response()->json([
                'message' => __('Sport has been created successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to store Sport: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to create Sport.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function update(UpdateSportRequest $request): JsonResponse
    {
        try {
            $data = $this->sportService->update($request);

            return response()->json([
                'message' => __('Sport has been updated successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to updated Sport: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to updated Sport.')], Response::HTTP_BAD_REQUEST);
        }
    }

    //    public function delete(DeleteAdvertisementRequest $request): JsonResponse
    //    {
    //        try {
    //            $this->advertisementService->delete($request);
    //
    //            return response()->json([
    //                'message' => __('Adverstisement has been deleted successfully.'),
    //            ], Response::HTTP_OK);
    //        } catch (Exception $exception) {
    //            Log::error('Unable to delete Adverstisement: '.$exception->getMessage());
    //
    //            return response()->json(['message' => __('Failed to delete Adverstisement.')], Response::HTTP_BAD_REQUEST);
    //        }
    //    }
}
