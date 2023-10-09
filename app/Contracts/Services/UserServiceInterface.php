<?php

namespace App\Contracts;

use App\Models\User;

interface UserServiceInterface
{
    public function getUser(): ?User;

    public function store(): array;

    public function update(): array;

    public function delete(): bool;
}
