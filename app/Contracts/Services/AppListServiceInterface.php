<?php

namespace App\Contracts\Services;

use App\Services\Data\AppList\GetCompanyListByKeyRequest;
use App\Services\Data\AppList\UpdateCompanyListRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface AppListServiceInterface
{
    public function get(GetCompanyListByKeyRequest $data): array;

    public function getAllAppLists(): LengthAwarePaginator;

    public function getAllAppListKeys(): Collection;

    public function updateCompanyList(UpdateCompanyListRequest $data): bool;
}
