<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\CompanyServiceInterface;
use App\Contracts\Services\UserServiceInterface;
use App\Enums\UserType;
use App\Services\Data\Company\CreateCompanyRequest;
use App\Services\Data\Register\RegisterCompanyRequest;
use App\Services\Data\Register\RegisterUserRequest;
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

    public function registerUser(RegisterUserRequest $request): JsonResponse
    {
        try {
            $createUserRequest = CreateUserRequest::from($request->toArray());

            $data = $this->userService->store($createUserRequest);

            return response()->json([
                'message' => __('User has been created successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to create user: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to create User.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function registerCompany(RegisterCompanyRequest $request): JsonResponse
    {
        try {
            $request->createUserRequest->type = UserType::COMPANY_USER->name;

            $createCompanyRequest = CreateCompanyRequest::from($request->toArray());

            $data = $this->companyService->store($createCompanyRequest);

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
