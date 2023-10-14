<?php

namespace App\Contracts\Services;

use App\Models\User;
use App\Services\Data\User\CreateUserRequest;
use App\Services\Data\User\DeleteUserRequest;
use App\Services\Data\User\GetUserRequest;
use App\Services\Data\User\UpdateUserRequest;

interface UserServiceInterface
{
    public function get(GetUserRequest $data): array;

    public function store(CreateUserRequest $data): User;

    public function update(UpdateUserRequest $data): array;

    public function delete(DeleteUserRequest $data): bool;
}
