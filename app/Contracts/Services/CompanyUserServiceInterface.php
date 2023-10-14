<?php

namespace App\Contracts\Services;

interface CompanyUserServiceInterface
{
    public function store(string|int $companyId, string|int $userId): bool;

    public function delete(string|int $companyId, string|int $userId): bool;
}
