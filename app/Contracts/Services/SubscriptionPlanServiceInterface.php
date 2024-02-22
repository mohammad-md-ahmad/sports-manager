<?php

namespace App\Contracts\Services;

use App\Models\SubscriptionPlan;
use App\Services\Data\SubscriptionPlan\CreateSubscriptionPlanRequest;
use App\Services\Data\SubscriptionPlan\UpdateSubscriptionPlanRequest;

interface SubscriptionPlanServiceInterface
{
    public function store(CreateSubscriptionPlanRequest $data): SubscriptionPlan;

    public function update(UpdateSubscriptionPlanRequest $data): SubscriptionPlan;
}
