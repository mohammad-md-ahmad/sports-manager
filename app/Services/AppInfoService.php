<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\AppInfoServiceInterface;
use App\Models\AppInfo;
use App\Models\AppList;
use App\Services\Data\AppInfo\GetAppInfoByKey;
use App\Services\Data\AppInfo\UpdateAppInfoRequest;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AppInfoService implements AppInfoServiceInterface
{
    /**
     * @throws Exception
     */
    public function get(GetAppInfoByKey $data): array
    {
        try {
            $appInfo = AppInfo::query()->where('key', $data->key)->first();

            return [
                $data->key => $appInfo->value,
            ];
        } catch (Exception $exception) {
            Log::error('AppInfoService::get: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function getAllAppInfos(): LengthAwarePaginator
    {
        try {
            $appInfos = AppInfo::query()->jsonPaginate();

            return $appInfos;
        } catch (Exception $exception) {
            Log::error('AppInfoService::getAllAppInfos: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function getAllAppInfoKeys(): Collection
    {
        try {
            $appInfos = AppList::query()->pluck('key');

            return $appInfos;
        } catch (Exception $exception) {
            Log::error('AppInfoService::getAllAppInfoKeys: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function update(UpdateAppInfoRequest $data): AppInfo
    {
        try {
            DB::beginTransaction();

            $info = AppInfo::updateOrCreate([
                'key' => $data->key,
            ], [
                'value' => $data->value,
            ]);

            DB::commit();

            return $info;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('AppInfoService::update: '.$exception->getMessage());

            throw $exception;
        }
    }
}
