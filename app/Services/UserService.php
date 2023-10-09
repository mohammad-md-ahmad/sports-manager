<?php

namespace App\Services;

use App\Contracts\UserServiceInterface;
use App\Models\User;

class UserService implements UserServiceInterface
{
    public function getUser(): User
    {
        return User::first();
    }

    public function store(): array
    {
        return [];
    }

    public function update(): array
    {
        return [];
    }

    public function delete(): bool
    {
        return true;
    }
}
