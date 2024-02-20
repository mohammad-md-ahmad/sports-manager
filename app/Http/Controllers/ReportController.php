<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\ReportServiceInterface;
use App\Services\Data\Report\GetCompanyReportByKey;
use App\Services\Data\Report\GetReportByKey;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{
    public function __construct(
        protected ReportServiceInterface $reportService
    ) {
    }

    public function get(GetReportByKey $request): JsonResponse
    {
        try {
            $data = $this->reportService->get($request);

            return response()->json([
                'message' => __($request->key.' Report has been retrieved successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to retrieve Report!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getByCompany(GetCompanyReportByKey $request): JsonResponse
    {
        try {
            $data = $this->reportService->getByCompany($request);

            return response()->json([
                'message' => __($request->key.' Report has been retrieved successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to retrieve Report!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
