<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Services\UserServiceInterface;
use App\Enums\UserType;
use App\Services\Data\User\CreateUserRequest;
use App\Services\Data\User\DeleteUserRequest;
use App\Services\Data\User\GetAllUsersRequest;
use App\Services\Data\User\GetUserRequest;
use App\Services\Data\User\UpdateUserRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function __construct(
        protected UserServiceInterface $userService
    ) {
    }

    public function getAll(GetAllUsersRequest $request): JsonResponse
    {
        try {
            $data = $this->userService->getAll($request);

            return response()->json([
                'message' => __('Users has been retrieved successfully!'),
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            return response()->json([
                'message' => __('Unable to retrieve users!'),
                'errors' => $exception->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function get(GetUserRequest $request): JsonResponse
    {
        try {
            $data = $this->userService->get($request);

            return response()->json([
                'message' => __('User has been retrieved successfully.'),
                'data' => $data->toArray(),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to retrieve user: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to retrieve User.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function storeAdmin(CreateUserRequest $request): JsonResponse
    {
        try {
            $request->type = UserType::ADMIN->name;

            $user = $this->userService->store($request);

            return response()->json([
                'message' => __('Admin has been created successfully.'),
                'data' => $user,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to store Admin: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to store Admin.')], Response::HTTP_BAD_REQUEST);
        }
    }

    protected function store(CreateUserRequest $request): JsonResponse
    {
        try {
            $user = $this->userService->store($request);

            return response()->json([
                'message' => __('User has been created successfully.'),
                'data' => $user,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to store user: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function update(UpdateUserRequest $request): JsonResponse
    {
        try {
            $user = $this->userService->update($request);

            return response()->json([
                'message' => __('User has been updated successfully.'),
                'data' => $user,
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to update user: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to update user.')], Response::HTTP_BAD_REQUEST);
        }
    }

    public function delete(DeleteUserRequest $request): JsonResponse
    {
        try {
            $this->userService->delete($request);

            return response()->json([
                'message' => __('User has been deleted successfully.'),
            ], Response::HTTP_OK);
        } catch (Exception $exception) {
            Log::error('Unable to delete user: '.$exception->getMessage());

            return response()->json(['message' => __('Failed to delete user.')], Response::HTTP_BAD_REQUEST);
        }
    }
}
