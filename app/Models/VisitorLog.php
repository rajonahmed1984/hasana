<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class VisitorLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'ip_address',
        'user_agent',
        'device_type',
        'browser',
        'platform',
        'path',
        'page_type',
        'item_id',
        'item_name',
        'duration_seconds',
        'visited_at',
    ];

    protected $casts = [
        'visited_at' => 'datetime',
        'duration_seconds' => 'integer',
    ];

    /**
     * Scope for today
     */
    public function scopeToday($query)
    {
        return $query->whereDate('visited_at', Carbon::today());
    }

    /**
     * Scope for this week (last 7 days or current week)
     */
    public function scopeThisWeek($query)
    {
        return $query->where('visited_at', '>=', Carbon::now()->subDays(7));
    }

    /**
     * Scope for this month (last 30 days)
     */
    public function scopeThisMonth($query)
    {
        return $query->where('visited_at', '>=', Carbon::now()->subDays(30));
    }

    /**
     * Scope by page type
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('page_type', $type);
    }

    /**
     * Formatted duration in Bengali
     */
    public function getDurationFormattedAttribute(): string
    {
        $sec = $this->duration_seconds ?? 0;
        if ($sec < 60) {
            return self::banglaDigits($sec) . ' সেকেন্ড';
        }

        $min = floor($sec / 60);
        $remSec = $sec % 60;
        if ($remSec === 0) {
            return self::banglaDigits($min) . ' মিনিট';
        }

        return self::banglaDigits($min) . ' মিনিট ' . self::banglaDigits($remSec) . ' সে.';
    }

    /**
     * Helper to convert numbers to Bengali digits
     */
    public static function banglaDigits($number): string
    {
        $bn = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        $en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        return str_replace($en, $bn, (string)$number);
    }
}
