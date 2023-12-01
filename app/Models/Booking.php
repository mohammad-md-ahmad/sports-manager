<?php

namespace App\Models;

use App\Enums\BookingStatus;
use Dyrynda\Database\Casts\EfficientUuid;
use Dyrynda\Database\Support\BindsOnUuid;
use Dyrynda\Database\Support\GeneratesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $id
 * @property string $uuid
 * @property string $user_id
 * @property string $schedule_details_id
 * @property BookingStatus $status
 * @property ScheduleDetails $scheduleDetails
 * @property User $customerUser
 */
class Booking extends Model
{
    use BindsOnUuid;
    use GeneratesUuid;
    use HasFactory;
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

    public function scheduleDetails(): BelongsTo
    {
        return $this->belongsTo(ScheduleDetails::class);
    }

    public function customerUser(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
