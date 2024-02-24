<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\Parsers\Money\DecimalMoneyParserInterface;
use App\Contracts\Services\SubscriptionPlanServiceInterface;
use App\Models\CompanySubscriptionPlan;
use App\Models\Currency;
use App\Models\SubscriptionPlan;
use App\Services\Data\SubscriptionPlan\CreateCompanySubscriptionPlanRequest;
use App\Services\Data\SubscriptionPlan\CreateSubscriptionPlanRequest;
use App\Services\Data\SubscriptionPlan\DeleteSubscriptionPlanRequest;
use App\Services\Data\SubscriptionPlan\GetSubscriptionPlanRequest;
use App\Services\Data\SubscriptionPlan\UpdateSubscriptionPlanRequest;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubscriptionPlanService implements SubscriptionPlanServiceInterface
{
    public function __construct(
        protected DecimalMoneyParserInterface $moneyParser,
    ) {
    }

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
            /** @var Currency $currency */
            $currency = Currency::findOrFail($data->currency_id);

            $price = $this->moneyParser->parse($data->decimal_price, $currency->iso_short_code);

            DB::beginTransaction();

            $subscriptionPlan = SubscriptionPlan::create(array_merge($data->toArray(), ['price' => $price]));

            DB::commit();

            return $subscriptionPlan;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error($exception->getMessage());

            throw $exception;
        }
    }

    public function update(UpdateSubscriptionPlanRequest $data): SubscriptionPlan
    {
        try {
            /** @var SubscriptionPlan $subscriptionPlan */
            $subscriptionPlan = SubscriptionPlan::findOrFail($data->id);

            /** @var Currency $currency */
            $currency = Currency::findOrFail($data->currency_id);

            $price = $this->moneyParser->parse($data->decimal_price, $currency->iso_short_code);

            DB::beginTransaction();

            $subscriptionPlan->update(array_merge($data->toArray(), ['price' => $price]));

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

    public function storeCompanySubscriptionPlan(CreateCompanySubscriptionPlanRequest $data): CompanySubscriptionPlan
    {
        try {
            /** @var SubscriptionPlan $subscriptionPlan */
            $subscriptionPlan = SubscriptionPlan::findOrFail($data->subscription_plan_id);

            $price = $this->moneyParser->parse($data->decimal_price, $subscriptionPlan->currency->iso_short_code);

            $modelData = array_merge(Arr::except($data->toArray(), ['company', 'decimal_price']), ['price' => $price, 'company_id' => (string) $data->company->id]);

            DB::beginTransaction();

            $companySubscriptionPlan = CompanySubscriptionPlan::create($modelData);

            DB::commit();

            /** @var CompanySubscriptionPlan $companySubscriptionPlan */
            $companySubscriptionPlan = CompanySubscriptionPlan::with(['subscriptionPlan'])->findOrFail($companySubscriptionPlan->id);

            return $companySubscriptionPlan;
        } catch (Exception $exception) {
            DB::rollBack();

            Log::error($exception->getMessage());

            throw $exception;
        }
    }
}
