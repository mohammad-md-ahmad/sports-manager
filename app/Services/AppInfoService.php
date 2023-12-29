<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\AppInfoServiceInterface;
use App\Models\AppInfo;
use App\Services\Data\AppInfo\GetAppInfoByKey;
use Exception;
use Illuminate\Support\Facades\Log;

class AppInfoService implements AppInfoServiceInterface
{
    public function get(GetAppInfoByKey $data): array
    {
        try {
            $companyInfo = AppInfo::query()->where('key', $data->key)->first();

            return [
                $data->key => $companyInfo->value,
            ];
        } catch (Exception $exception) {
            Log::error('AppInfoService::get: '.$exception->getMessage());

            throw $exception;
        }
    }
}
