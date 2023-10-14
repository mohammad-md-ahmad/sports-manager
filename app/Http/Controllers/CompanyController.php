<?php

namespace App\Http\Controllers;

use App\Contracts\Services\CompanyServiceInterface;
use App\Services\Data\Company\CreateCompanyRequest;
use App\Services\Data\User\DeleteUserRequest;
use App\Services\Data\User\GetUserRequest;
use App\Services\Data\User\UpdateUserRequest;
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

    public function store(CreateCompanyRequest $request): JsonResponse
    {
        try {
            $user = $this->companyService->store($request);

            return response()->json([
                'message' => __('Company has been created successfully.'),
                'data' => $user,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to store Company: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to create Company.')], Response::HTTP_BAD_REQUEST);
        }
    }

    // public function update(UpdateUserRequest $request): JsonResponse
    // {
    //     try {
    //         $user = $this->userService->update($request);

    //         return response()->json([
    //             'message' => __('User has been updated successfully.'),
    //             'data' => $user,
    //         ], Response::HTTP_OK);
    //     } catch (Exception $exception) {
    //         Log::error('Unable to update user: '.$exception->getMessage());

    //         return response()->json(['message' => __('Failed to update user.')], Response::HTTP_BAD_REQUEST);
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
