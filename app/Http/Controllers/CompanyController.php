<?php

namespace App\Http\Controllers;

use App\Contracts\Services\CompanyServiceInterface;
use App\Services\Data\Company\CreateCompanyRequest;
use App\Services\Data\Company\GetCompanyRequest;
use App\Services\Data\Company\UpdateCompanyRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class CompanyController extends Controller
{
    public function __construct(
        protected CompanyServiceInterface $companyService
    ) {
    }

    public function get(GetCompanyRequest $request): JsonResponse
    {
        try {
            $data = $this->companyService->get($request);

            return response()->json([
                'message' => __('Company has been retrieved successfully.'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to retrieve Company: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to retrieve Company.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function store(CreateCompanyRequest $request): JsonResponse
    {
        try {
            $data = $this->companyService->store($request);

            return response()->json([
                'message' => __('Company has been created successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to store Company: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to create Company.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function update(UpdateCompanyRequest $request): JsonResponse
    {
        try {
            $data = $this->companyService->update($request);

            return response()->json([
                'message' => __('Company has been updated successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to update Company: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to update Company.')], Response::HTTP_BAD_REQUEST);
        }
    }

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
