<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Services\SubscriptionPlanServiceInterface;
use App\Models\SubscriptionPlan;
use App\Services\Data\SubscriptionPlan\CreateSubscriptionPlanRequest;
use App\Services\Data\SubscriptionPlan\UpdateSubscriptionPlanRequest;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubscriptionPlanService implements SubscriptionPlanServiceInterface
{
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
}
