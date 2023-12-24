<?php

namespace App\Contracts\Services;

use App\Models\User;
use App\Services\Data\User\CreateUserRequest;
use App\Services\Data\User\DeleteUserRequest;
use App\Services\Data\User\GetUserRequest;
use App\Services\Data\User\UpdateUserRequest;
use Illuminate\Pagination\LengthAwarePaginator;

interface UserServiceInterface
{
    public function getAll(): LengthAwarePaginator;

    public function get(GetUserRequest $data): User;

    public function store(CreateUserRequest $data): User;

    public function update(UpdateUserRequest $data): User;

    public function delete(DeleteUserRequest $data): bool;
}
