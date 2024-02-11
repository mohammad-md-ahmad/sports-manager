<?php

namespace App\Models;

use App\Enums\NotificationCategory;
use App\Enums\NotificationStatus;
use Dyrynda\Database\Casts\EfficientUuid;
use Dyrynda\Database\Support\BindsOnUuid;
use Dyrynda\Database\Support\GeneratesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property string $id
 * @property string $uuid
 * @property string $title
 * @property string $notification
 * @property NotificationStatus $status
 * @property NotificationCategory $category
 */
class Notification extends Model
{
    use BindsOnUuid;
    use GeneratesUuid;
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'receiver_type',
        'receiver_id',
        'title',
        'notification', 'datetime:Y-m-d H:i:s',
        'status',
        'category',
        'opened_at',
        'action_taken_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'uuid' => EfficientUuid::class,
        'status' => NotificationStatus::class,
        'category' => NotificationCategory::class,
        'opened_at' => 'datetime:Y-m-d H:i:s',
        'action_taken_at' => 'datetime:Y-m-d H:i:s',
    ];

    public function receiver(): MorphTo
    {
        return $this->morphTo();
    }

    public function bookingNotification(): HasOne
    {
        return $this->hasOne(BookingNotification::class);
    }

    public function surveyNotification(): HasOne
    {
        return $this->hasOne(SurveyNotification::class);
    }
}
