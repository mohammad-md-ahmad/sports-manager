<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\CompanyFacilityServiceInterface;
use App\Services\Data\CompanyFacility\CreateCompanyFacilityRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class CompanyFacilityController extends Controller
{
    public function __construct(
        protected CompanyFacilityServiceInterface $companyFacilityService
    ) {
    }

    // public function get(GetUserRequest $request): JsonResponse
    // {
    //     try {
    //         $user = $this->companyService->get($request);

    //         return response()->json([
    //             'message' => __('User has been retrieved successfully.'),
    //             'data' => $user,
    //         ], Response::HTTP_OK);
    //     } catch (Exception $exception) {
    //         Log::error('Unable to retrieve user: '.$exception->getMessage());

    //         return response()->json(['message' => __('Failed to retrieve user.')], Response::HTTP_BAD_REQUEST);
    //     }
    // }

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
