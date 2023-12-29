<?php

namespace App\Contracts\Services;

use App\Services\Data\AppInfo\GetAppInfoByKey;

interface AppInfoServiceInterface
{
    public function get(GetAppInfoByKey $data): array;
}
