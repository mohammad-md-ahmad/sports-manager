<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\CompanyFacilityServiceInterface;
use App\Services\Data\CompanyFacility\CreateCompanyFacilityRequest;
use App\Services\Data\CompanyFacility\GetCompanyFacilitiesRequest;
use App\Services\Data\CompanyFacility\GetCompanyFacilityRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class CompanyFacilityController extends Controller
{
    public function __construct(
        protected CompanyFacilityServiceInterface $companyFacilityService
    ) {
    }

    public function get(GetCompanyFacilityRequest $request): JsonResponse
    {
        try {
            $data = $this->companyFacilityService->get($request);

            return response()->json([
                'message' => __('Facility has been retrieved successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to retrieve Facility: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to retrieve Facility.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getAll(Request $request): JsonResponse
    {
        try {
            $data = $this->companyFacilityService->getAll();

            return response()->json([
                'message' => __('Facilities has been retrieved successfully.'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to retrieve Facilities: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to retrieve Facilities.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getAllByCompany(GetCompanyFacilitiesRequest $request): JsonResponse
    {
        try {
            $data = $this->companyFacilityService->getAllByCompany($request);

            return response()->json([
                'message' => __('Facilities has been retrieved successfully.'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to retrieve Facilities: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to retrieve Facilities.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function store(CreateCompanyFacilityRequest $request): JsonResponse
    {
        try {
            $data = $this->companyFacilityService->store($request);

            return response()->json([
                'message' => __('Company Facility has been created successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to store Company Facility : '.$exception->getMessage());

            return response()->json(['message' => __('Failed to create Company Facility .')], Response::HTTP_BAD_REQUEST);
        }
    }

    // public function update(UpdateCompanyRequest $request): JsonResponse
    // {
    //     try {
    //         $data = $this->companyService->update($request);

    //         return response()->json([
    //             'message' => __('Company has been updated successfully.'),
    //             'data' => $data->toArray(),
    //         ], Response::HTTP_OK);
    //     } catch (Exception $exception) {
    //         Log::error('Unable to update Company: '.$exception->getMessage());

    //         return response()->json(['message' => __('Failed to update Company.')], Response::HTTP_BAD_REQUEST);
    //     }
    // }

    // public function delete(DeleteUserRequest $request): JsonResponse
    // {
    //     try {
    //         $this->userService->delete($request);

    //         return response()->json([
    //             'message' => __('User has been deleted successfully.'),
    //         ], Response::HTTP_OK);
    //     } catch (Exception $exception) {
    //         Log::error('Unable to delete user: '.$exception->getMessage());

    //         return response()->json(['message' => __('Failed to delete user.')], Response::HTTP_BAD_REQUEST);
    //     }
    // }
}
