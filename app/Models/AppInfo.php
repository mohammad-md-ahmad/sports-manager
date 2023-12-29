<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $key
 * @property string $value
 */
class AppInfo extends Model
{
    protected $table = 'app_info';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'key',
        'value',
    ];

    protected $hidden = [
        'id',
        'created_at',
        'updated_at',
    ];
}
