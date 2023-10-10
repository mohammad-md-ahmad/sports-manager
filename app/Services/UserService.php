<?php

namespace App\Services;

use App\Contracts\Services\UserServiceInterface;
use App\Models\User;
use App\Services\Data\User\CreateUserRequest;
use App\Services\Data\User\DeleteUserRequest;
use App\Services\Data\User\GetUserRequest;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserService implements UserServiceInterface
{
    public function get(GetUserRequest $data): array
    {
        try {
            /** @var User $user */
            $user = User::findOrFail($data->id);

            return $user->toArray();
        } catch (Exception $exception) {
            Log::error('UserService::getUser: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function store(CreateUserRequest $data): array
    {
        try {
            $data->password = Hash::make($data->password);

            /** @var User $user */
            $user = User::create($data->toArray());

            return $user->toArray();
        } catch (Exception $exception) {
            Log::error('UserService::store: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function update(): array
    {
        return [];
    }

    public function delete(DeleteUserRequest $data): bool
    {
        try {
            return User::findOrFail($data->id)->delete();
        } catch (Exception $exception) {
            Log::error('UserService::delete: '.$exception->getMessage());

            throw $exception;
        }
    }
}
