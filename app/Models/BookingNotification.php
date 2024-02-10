<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $booking_id
 * @property string $notification_id
 */
class BookingNotification extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'booking_id',
        'notification_id',
    ];

    protected $hidden = [
        'id',
        'created_at',
        'updated_at',
    ];
}
