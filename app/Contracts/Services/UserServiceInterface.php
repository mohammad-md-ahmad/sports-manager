<?php

namespace App\Contracts\Services;

use App\Services\Data\User\CreateUserRequest;
use App\Services\Data\User\DeleteUserRequest;
use App\Services\Data\User\GetUserRequest;

interface UserServiceInterface
{
    public function get(GetUserRequest $data): array;

    public function store(CreateUserRequest $data): array;

    public function update(): array;

    public function delete(DeleteUserRequest $data): bool;
}
