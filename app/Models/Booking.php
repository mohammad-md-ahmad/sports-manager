<?php

namespace App\Models;

use App\Enums\BookingStatus;
use Carbon\Carbon;
use Dyrynda\Database\Casts\EfficientUuid;
use Dyrynda\Database\Support\BindsOnUuid;
use Dyrynda\Database\Support\GeneratesUuid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Staudenmeir\EloquentHasManyDeep\HasOneDeep;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

/**
 * @property string $id
 * @property string $uuid
 * @property string $user_id
 * @property string $schedule_details_id
 * @property BookingStatus $status
 * @property User $customerUser
 * @property ScheduleDetails $scheduleDetails
 * @property Company $company
 * @property Rating $rating
 */
class Booking extends Model
{
    use BindsOnUuid;
    use GeneratesUuid;
    use HasFactory;
    use HasRelationships;
    use SoftDeletes;

    /**
     *  approved_at field should be added
     */

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'customer_user_id',
        'schedule_details_id',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'uuid' => EfficientUuid::class,
        'status' => BookingStatus::class,
    ];

    protected $hidden = [
        'id',
        'customer_user_id',
        'schedule_details_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $appends = [
        'date',
        'is_ratable',
    ];

    public function date(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->scheduleDetails()->select('date_time_from')->get()->first()->date_time_from;
            }
        );
    }

    public function isRatable(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->rating()->count() <= 0 && $this->bookingIsOver();
            }
        );
    }

    public function customerUser(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scheduleDetails(): BelongsTo
    {
        return $this->belongsTo(ScheduleDetails::class);
    }

    public function company(): HasOneDeep
    {
        return $this->hasOneDeepFromReverse((new Company())->bookings());
    }

    public function rating(): HasOne
    {
        return $this->hasOne(Rating::class);
    }

    public function bookingIsOver(): bool
    {
        return $this->status === BookingStatus::Approved && $this->scheduleDetails->date_time_from < Carbon::now();
    }
}
