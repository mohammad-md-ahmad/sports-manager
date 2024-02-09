<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $user_id
 * @property string $sport_id
 */
class UserFavoriteSport extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'sport_id',
    ];

    protected $hidden = [
        'id',
        'created_at',
        'updated_at',
    ];
}
