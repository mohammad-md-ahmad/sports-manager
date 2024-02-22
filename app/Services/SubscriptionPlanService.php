<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\SubscriptionPlanServiceInterface;
use App\Models\SubscriptionPlan;
use App\Services\Data\SubscriptionPlan\CreateSubscriptionPlanRequest;
use App\Services\Data\SubscriptionPlan\DeleteSubscriptionPlanRequest;
use App\Services\Data\SubscriptionPlan\GetSubscriptionPlanRequest;
use App\Services\Data\SubscriptionPlan\UpdateSubscriptionPlanRequest;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubscriptionPlanService implements SubscriptionPlanServiceInterface
{
    public function get(GetSubscriptionPlanRequest $data): SubscriptionPlan
    {
        try {
            /** @var SubscriptionPlan $subscriptionPlan */
            $subscriptionPlan = SubscriptionPlan::findOrFail($data->id);

            return $subscriptionPlan;
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    public function getAll(): LengthAwarePaginator
    {
        try {
            return SubscriptionPlan::jsonPaginate();
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    public function store(CreateSubscriptionPlanRequest $data): SubscriptionPlan
    {
        try {
            return SubscriptionPlan::create($data->toArray());
        } catch (Exception $exception) {
            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    public function update(UpdateSubscriptionPlanRequest $data): SubscriptionPlan
    {
        try {
            /** @var SubscriptionPlan $subscriptionPlan */
            $subscriptionPlan = SubscriptionPlan::findOrFail($data->id);

            DB::beginTransaction();

            $subscriptionPlan->update($data->toArray());

            DB::commit();

            $subscriptionPlan->refresh();

            return $subscriptionPlan;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    public function delete(DeleteSubscriptionPlanRequest $data): bool
    {
        try {
            /** @var SubscriptionPlan $subscriptionPlan */
            $subscriptionPlan = SubscriptionPlan::findOrFail($data->id);

            DB::beginTransaction();

            $subscriptionPlan->delete();

            DB::commit();

            return true;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error($exception->getMessage());

            throw $exception;
        }
    }
}
