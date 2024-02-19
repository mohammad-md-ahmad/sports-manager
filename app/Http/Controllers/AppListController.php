<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\AppListServiceInterface;
use App\Services\Data\AppList\GetCompanyListByKeyRequest;
use App\Services\Data\AppList\UpdateCompanyListRequest;
use App\Services\Data\AppList\UpdateListRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class AppListController extends Controller
{
    public function __construct(
        protected AppListServiceInterface $AppListService
    ) {
    }

    public function get(GetCompanyListByKeyRequest $request): JsonResponse
    {
        try {
            $data = $this->AppListService->get($request);

            return response()->json([
                'message' => __('List has been retrieved successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to retrieve List!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getAllAppLists(Request $request): JsonResponse
    {
        try {
            $data = $this->AppListService->getAllAppLists($request);

            return response()->json([
                'message' => __('App Lists has been retrieved successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to retrieve App Lists!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getAllAppListKeys(Request $request): JsonResponse
    {
        try {
            $data = $this->AppListService->getAllAppListKeys($request);

            return response()->json([
                'message' => __('App List Keys has been retrieved successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to retrieve App List Keys!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function update(UpdateListRequest $request): JsonResponse
    {
        try {
            $data = $this->AppListService->update($request);

            return response()->json([
                'message' => __('List has been updated successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to update List!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function updateCompanyList(UpdateCompanyListRequest $request): JsonResponse
    {
        try {
            $data = $this->AppListService->updateCompanyList($request);

            return response()->json([
                'message' => __('List has been updated successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to update List!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
