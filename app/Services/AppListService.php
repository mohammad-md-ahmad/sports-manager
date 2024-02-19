<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\AppListServiceInterface;
use App\Models\AppList;
use App\Models\CompanyList;
use App\Services\Data\AppList\GetCompanyListByKeyRequest;
use App\Services\Data\AppList\UpdateCompanyListRequest;
use App\Services\Data\AppList\UpdateListRequest;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AppListService implements AppListServiceInterface
{
    public function get(GetCompanyListByKeyRequest $data): array
    {
        try {
            $companyList = CompanyList::query()->where([
                ['key', '=', $data->key],
                ['company_id', '=', $data->company->id],
            ])->first();

            $appList = AppList::query()->where('key', $data->key)->first();

            return [
                'company_list' => [
                    $data->key => $companyList?->value ?? [],
                ],
                'app_list' => [
                    $data->key => $appList->value,
                ],
            ];
        } catch (Exception $exception) {
            Log::error('AppListService::get: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function getAllAppLists(): LengthAwarePaginator
    {
        try {
            $appLists = AppList::query()->jsonPaginate();

            return $appLists;
        } catch (Exception $exception) {
            Log::error('AppListService::getAllAppLists: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function getAllAppListKeys(): Collection
    {
        try {
            $appLists = AppList::query()->pluck('key');

            return $appLists;
        } catch (Exception $exception) {
            Log::error('AppListService::getAllAppLists: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function update(UpdateListRequest $data): AppList
    {
        try {
            DB::beginTransaction();

            $list = AppList::updateOrCreate([
                'key' => $data->key,
            ], [
                'value' => $data->value,
            ]);

            DB::commit();

            return $list;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('AppListService::updateList: '.$exception->getMessage());

            throw $exception;
        }
    }

    /**
     * @throws Exception
     */
    public function updateCompanyList(UpdateCompanyListRequest $data): bool
    {
        try {
            $companyList = CompanyList::query()->where([
                ['key', '=', $data->key],
                ['company_id', '=', $data->company->id],
            ])->first();

            DB::beginTransaction();

            if ($companyList) {
                $companyList->value = $data->value;

                $companyList->save();
            } else {
                $companyList = new CompanyList();

                $companyList->company_id = $data->company->id;
                $companyList->key = $data->key;
                $companyList->value = $data->value;

                $companyList->save();
            }

            DB::commit();

            return true;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('AppListService::updateCompanyList: '.$exception->getMessage());

            throw $exception;
        }
    }
}
