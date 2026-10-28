<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeviceToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'token',
        'platform',
        'user_agent',
        'ip_address',
        'latitude',
        'longitude',
        'city_name',
        'timezone',
        'prayer_enabled',
        'ayah_enabled',
        'prayer_prefs',
        'last_notified',
        'is_active',
        'last_active_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'prayer_enabled' => 'boolean',
        'ayah_enabled' => 'boolean',
        'prayer_prefs' => 'array',
        'last_notified' => 'array',
        'last_active_at' => 'datetime',
    ];
}
