<?php

namespace App\Contracts\Services;

use App\Models\AppInfo;
use App\Services\Data\AppInfo\GetAppInfoByKey;
use App\Services\Data\AppInfo\UpdateAppInfoBatchRequest;
use App\Services\Data\AppInfo\UpdateAppInfoRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface AppInfoServiceInterface
{
    public function get(GetAppInfoByKey $data): array;

    public function getAllAppInfos(): LengthAwarePaginator;

    public function getAllAppInfoKeys(): Collection;

    public function update(UpdateAppInfoRequest $data): AppInfo;

    public function batchUpdate(UpdateAppInfoBatchRequest $data): bool;
}
