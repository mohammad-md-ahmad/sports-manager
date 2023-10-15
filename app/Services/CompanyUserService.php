<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\CompanyUserServiceInterface;
use App\Models\Company;
use App\Models\CompanyUser;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CompanyUserService implements CompanyUserServiceInterface
{
    public function store(string|int $companyId, string|int $userId): bool
    {
        try {
            DB::beginTransaction();

            CompanyUser::create([
                'company_id' => $companyId,
                'user_id' => $userId,
            ]);

            DB::commit();

            return true;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error('CompanyUserService::store: '.$exception->getMessage());

            throw $exception;
        }
    }

    public function delete(string|int $companyId, string|int $userId): bool
    {
        try {
            DB::transaction(function () use ($companyId, $userId) {
                Company::query()->where([
                    ['company_id', '=', $companyId],
                    ['user_id', '=', $userId],
                ])->delete();
            });

            return true;
        } catch (Exception $exception) {
            Log::error('CompanyUserService::delete: '.$exception->getMessage());

            throw $exception;
        }
    }
}
