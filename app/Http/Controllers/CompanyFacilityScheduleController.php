<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\CompanyFacilityScheduleServiceInterface;
use App\Services\Data\CompanyFacilitySchedule\CreateCompanyFacilityScheduleBatchRequest;
use App\Services\Data\CompanyFacilitySchedule\CreateCompanyFacilityScheduleRequest;
use App\Services\Data\CompanyFacilitySchedule\DeleteCompanyFacilityScheduleDetailRequest;
use App\Services\Data\CompanyFacilitySchedule\GetCompanyFacilityScheduleRequest;
use App\Services\Data\CompanyFacilitySchedule\GetCompanyScheduleRequest;
use App\Services\Data\CompanyFacilitySchedule\GetScheduleRequest;
use App\Services\Data\CompanyFacilitySchedule\UpdateCompanyFacilityScheduleDetailRequest;
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

    public function getCompanySchedule(GetCompanyScheduleRequest $request): JsonResponse
    {
        try {
            $data = $this->companyFacilityScheduleService->getCompanySchedule($request);

            return response()->json([
                'message' => __('Company Schedule has been retrieved successfully'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to retrieve Company Schedule : '.$exception->getMessage());

            return response()->json(['message' => __('Failed to retrieve Company Schedule.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getFacilitySchedule(GetCompanyFacilityScheduleRequest $request): JsonResponse
    {
        try {
            $data = $this->companyFacilityScheduleService->getFacilitySchedule($request);

            return response()->json([
                'message' => __('Facility Schedule has been retrieved successfully'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to retrieve Facility Schedule : '.$exception->getMessage());

            return response()->json(['message' => __('Failed to retrieve Facility Schedule.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getSchedule(GetScheduleRequest $request): JsonResponse
    {
        try {
            $data = $this->companyFacilityScheduleService->getSchedule($request);

            return response()->json([
                'message' => __('Schedule has been retrieved successfully'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to retrieve Schedule : '.$exception->getMessage());

            return response()->json(['message' => __('Failed to retrieve Schedule.')], Response::HTTP_BAD_REQUEST);
        }
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

    public function storeBatch(CreateCompanyFacilityScheduleBatchRequest $request): JsonResponse
    {
        try {
            $data = $this->companyFacilityScheduleService->storeBatch($request);

            return response()->json([
                'message' => __('Company Facility Schedule has been created successfully.'),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to store Company Facility Schedule : '.$exception->getMessage());

            return response()->json(['message' => __('Failed to create Company Facility Schedule.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function update(UpdateCompanyFacilityScheduleDetailRequest $request): JsonResponse
    {
        try {
            $data = $this->companyFacilityScheduleService->update($request);

            return response()->json([
                'message' => __('Company Facility Schedule Detail has been updated successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to store Company Facility Schedule Detail: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to create Company Facility Schedule Detail.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function delete(DeleteCompanyFacilityScheduleDetailRequest $request): JsonResponse
    {
        try {
            $this->companyFacilityScheduleService->delete($request);

            return response()->json([
                'message' => __('Company Facility Schedule Detail has been deleted successfully.'),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to delete Company Facility Schedule Detail: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to delete Company Facility Schedule Detail.')], Response::HTTP_BAD_REQUEST);
        }
    }
}
