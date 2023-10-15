<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\UserServiceInterface;
use App\Models\User;
use App\Services\Data\User\CreateUserRequest;
use App\Services\Data\User\DeleteUserRequest;
use App\Services\Data\User\GetUserRequest;
use App\Services\Data\User\UpdateUserRequest;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserService implements UserServiceInterface
{
    public function get(GetUserRequest $data): User
    {
        try {
            /** @var User $user */
            $user = User::findOrFail($data->id);

            return $user;
        } catch (Exception $exception) {
            Log::error('UserService::get: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function store(CreateUserRequest $data): User
    {
        try {
            $data->password = Hash::make($data->password);

            DB::beginTransaction();

            /** @var User $user */
            $user = User::create($data->toArray());

            DB::commit();

            return $user;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('UserService::store: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function update(UpdateUserRequest $data): User
    {
        try {
            /** @var User $user */
            $user = User::findOrFail($data->id);

            DB::beginTransaction();

            $user->update($data->toArray());

            DB::commit();

            return $user;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('UserService::update: '.$exception->getMessage());

            throw $exception;
        }
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
