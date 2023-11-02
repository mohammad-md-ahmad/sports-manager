<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\CompanyFacilityScheduleServiceInterface;
use App\Services\Data\CompanyFacilitySchedule\CreateCompanyFacilityScheduleRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class CompanyFacilityScheduleController extends Controller
{
    public function __construct(
        protected CompanyFacilityScheduleServiceInterface $companyFacilityScheduleService
    ) {
    }

    public function store(CreateCompanyFacilityScheduleRequest $request): JsonResponse
    {
        try {
            $data = $this->companyFacilityScheduleService->store($request);

            return response()->json([
                'message' => __('Company Facility Schedule has been created successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to store Company Facility Schedule : '.$exception->getMessage());

            return response()->json(['message' => __('Failed to create Company Facility Schedule.')], Response::HTTP_BAD_REQUEST);
        }
    }
}
