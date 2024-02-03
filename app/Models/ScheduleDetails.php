<?php

namespace App\Models;

use App\Casts\MoneyValue;
use App\Contracts\Formatters\Money\DecimalMoneyFormatterInterface;
use App\Enums\ScheduleDetailsStatus;
use Dyrynda\Database\Casts\EfficientUuid;
use Dyrynda\Database\Support\BindsOnUuid;
use Dyrynda\Database\Support\GeneratesUuid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;
use Money\Money;

/**
 * @property string $id
 * @property string $uuid
 * @property string $name
 * @property string $date_time_from
 * @property string $date_time_to
 * @property ScheduleDetailsStatus $status
 * @property Collection $bookings
 * @property Schedule $schedule
 * @property CompanyFacility $facility
 * @property Money $price
 */
class ScheduleDetails extends Model
{
    use BindsOnUuid;
    use GeneratesUuid;
    use HasFactory;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'schedule_id',
        'name',
        'date_time_from',
        'date_time_to',
        'status',
        'price',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'uuid' => EfficientUuid::class,
        'status' => ScheduleDetailsStatus::class,
        'price_money_value' => MoneyValue::class,
    ];

    protected $hidden = [
        'id',
        'price',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $appends = [
        'decimal_price',
    ];

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class, 'schedule_id');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function facility(): BelongsTo
    {
        return $this->schedule->facility();
    }

    public function priceMoneyValue(): Attribute
    {
        return Attribute::make(
            get: function () {
                return Money::{$this->schedule->facility->currency->iso_short_code}($this->attributes['price']);
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
