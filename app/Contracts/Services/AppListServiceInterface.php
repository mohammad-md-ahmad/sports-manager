<?php

namespace App\Contracts\Services;

use App\Services\Data\AppList\GetCompanyListByKeyRequest;
use App\Services\Data\AppList\UpdateCompanyListRequest;

interface AppListServiceInterface
{
    public function get(GetCompanyListByKeyRequest $data): array;

    public function updateCompanyList(UpdateCompanyListRequest $data): bool;
}
