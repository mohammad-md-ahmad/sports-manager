<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\CompanyServiceInterface;
use App\Contracts\Services\UserServiceInterface;
use App\Enums\UserType;
use App\Services\Data\Company\CreateCompanyRequest;
use App\Services\Data\User\CreateUserRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class RegisterController extends Controller
{
    public function __construct(
        protected UserServiceInterface $userService,
        protected CompanyServiceInterface $companyService,
    ) {
    }

    public function registerUser(CreateUserRequest $request): JsonResponse
    {
        try {
            $request->type = UserType::CUSTOMER_USER->name;
            $data = $this->userService->store($request);

            return response()->json([
                'message' => __('User has been created successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to create user: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to create User.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function registerCompany(CreateCompanyRequest $request): JsonResponse
    {
        try {
            $request->createUserRequest->type = UserType::COMPANY_USER->name;
            $data = $this->companyService->store($request);

            return response()->json([
                'message' => __('Company has been created successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to create Company: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to create Company.')], Response::HTTP_BAD_REQUEST);
        }
    }
}
