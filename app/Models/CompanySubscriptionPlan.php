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
    use SoftDeletes;

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
    ];

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function priceMoneyValue(): Attribute
    {
        return Attribute::make(
            get: function () {
                return Money::{$this->currency->iso_short_code}($this->attributes['price']);
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
}
