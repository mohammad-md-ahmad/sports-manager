<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\AppInfoServiceInterface;
use App\Services\Data\AppInfo\GetAppInfoByKey;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class AppInfoController extends Controller
{
    public function __construct(
        protected AppInfoServiceInterface $appInfoService
    ) {
    }

    public function get(GetAppInfoByKey $request): JsonResponse
    {
        try {
            $data = $this->appInfoService->get($request);

            return response()->json([
                'message' => __('App Info has been retrieved successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to retrieve App Info!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
