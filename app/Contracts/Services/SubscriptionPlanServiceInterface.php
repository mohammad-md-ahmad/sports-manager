<?php

namespace App\Contracts\Services;

use App\Models\SubscriptionPlan;
use App\Services\Data\SubscriptionPlan\CreateSubscriptionPlanRequest;
use App\Services\Data\SubscriptionPlan\DeleteSubscriptionPlanRequest;
use App\Services\Data\SubscriptionPlan\GetSubscriptionPlanRequest;
use App\Services\Data\SubscriptionPlan\UpdateSubscriptionPlanRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SubscriptionPlanServiceInterface
{
    public function get(GetSubscriptionPlanRequest $data): SubscriptionPlan;

    public function getAll(): LengthAwarePaginator;

    public function store(CreateSubscriptionPlanRequest $data): SubscriptionPlan;

    public function update(UpdateSubscriptionPlanRequest $data): SubscriptionPlan;

    public function delete(DeleteSubscriptionPlanRequest $data): bool;
}
