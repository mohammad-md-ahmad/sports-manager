<?php

namespace App\Models;

use App\Casts\MoneyValue;
use App\Contracts\Formatters\Money\DecimalMoneyFormatterInterface;
use Dyrynda\Database\Casts\EfficientUuid;
use Dyrynda\Database\Support\BindsOnUuid;
use Dyrynda\Database\Support\GeneratesUuid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Money\Money;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

/**
 * @property string $id
 * @property string $company_id
 * @property string $subscription_plan_id
 * @property string $effective_from
 * @property string $effective_to
 * @property Currency $currency
 */
class CompanySubscriptionPlan extends Model
{
    use BindsOnUuid;
    use GeneratesUuid;
    use HasFactory;
    use HasRelationships;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'subscription_plan_id',
        'price',
        'effective_from',
        'effective_to',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'uuid' => EfficientUuid::class,
        'price_money_value' => MoneyValue::class,
        'price' => MoneyValue::class,
        'effective_from' => 'datetime:Y-m-d H:i:s',
        'effective_to' => 'datetime:Y-m-d H:i:s',
    ];

    protected $appends = [
        'decimal_price',
        'is_active',
    ];

    protected $money_currency_map = [
        'price' => 'currency',
    ];

    public function subscriptionPlan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class);
    }

    public function currency()
    {
        return $this->subscriptionPlan->currency();
    }

    public function priceMoneyValue(): Attribute
    {
        return Attribute::make(
            get: function () {
                $subscriptionPlan = $this->subscriptionPlan()->first(); // Load the subscription plan

                if ($subscriptionPlan) {
                    $currencyCode = $subscriptionPlan->currency->iso_short_code;

                    return Money::$currencyCode($this->attributes['price']);
                }

                // Default to USD if subscription plan or currency is not found
                return Money::USD($this->attributes['price']);
            }
        );
    }

    public function decimalPrice(): Attribute
    {
        return Attribute::make(
            get: function () {
                return app(DecimalMoneyFormatterInterface::class)->format($this->price_money_value);
            }
        );
    }

    public function isActive(): Attribute
    {
        return Attribute::make(
            get: function () {
                $now = now()->startOfDay(); // Get current date at start of day
                $isWithinEffectiveDates = $now->gte($this->effective_from->startOfDay()) && $now->lte($this->effective_to->startOfDay());


                $companyId = $this->company_id; // Assuming you have a company_id attribute
                $lastPlan = CompanySubscriptionPlan::where('company_id', $companyId)
                    ->latest()
                    ->first();

                return $isWithinEffectiveDates && $this->id === $lastPlan->id;
            }
        );
    }
}
