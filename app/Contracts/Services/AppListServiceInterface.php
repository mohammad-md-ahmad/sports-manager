<?php

namespace App\Contracts\Services;

use App\Models\AppList;
use App\Services\Data\AppList\GetCompanyListByKeyRequest;
use App\Services\Data\AppList\UpdateCompanyListRequest;
use App\Services\Data\AppList\UpdateListRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface AppListServiceInterface
{
    public function get(GetCompanyListByKeyRequest $data): array;

    public function getAllAppLists(): LengthAwarePaginator;

    public function getAllAppListKeys(): Collection;

    public function update(UpdateListRequest $data): AppList;

    public function updateCompanyList(UpdateCompanyListRequest $data): bool;
}
