<?php

namespace App\Models;

use App\Enums\NotificationCategory;
use App\Enums\NotificationStatus;
use Dyrynda\Database\Casts\EfficientUuid;
use Dyrynda\Database\Support\BindsOnUuid;
use Dyrynda\Database\Support\GeneratesUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $uuid
 * @property string $title
 * @property string $notification
 * @property NotificationStatus $status
 * @property NotificationCategory $category
 * @property User $user
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
        'user_id',
        'title',
        'notification',
        'status',
        'category',
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
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
