<?php

namespace App\Services;

use Carbon\CarbonInterface;

/**
 * Offline solar prayer time calculator (Karachi method, Hanafi Asr).
 * Mirrors calculateSolarPrayerTimes() in resources/js/app/services/locationService.js
 * so server push notifications fire at the same minute the app shows.
 */
class PrayerTimes
{
    public const PRAYERS = [
        'fajr' => [
            'title' => 'ফজরের নামাজের সময় হয়েছে 🌅',
            'body' => 'আস-সালাতু খাইরুম মিনান নাওম — ঘুম থেকে নামাজ উত্তম। আসুন জামায়াতে নামাজ আদায় করি।',
        ],
        'dhuhr' => [
            'title' => 'যোহরের নামাজের সময় হয়েছে ☀️',
            'body' => 'যোহরের নামাজের ওয়াক্ত শুরু হয়েছে। দুনিয়াবী ব্যস্ততা ছেড়ে রবের ডাকে সাড়া দিন।',
        ],
        'asr' => [
            'title' => 'আসরের নামাজের সময় হয়েছে ⛅',
            'body' => 'আসরের নামাজের ওয়াক্ত শুরু হয়েছে। সময়মতো নামাজ আদায় করে অপরিসীম সওয়াব অর্জন করুন।',
        ],
        'maghrib' => [
            'title' => 'মাগরিবের নামাজের সময় হয়েছে 🌇',
            'body' => 'সূর্যাস্তের সাথে সাথে মাগরিবের ওয়াক্ত শুরু হয়েছে। বিলম্ব না করে দ্রুত নামাজ আদায় করুন।',
        ],
        'isha' => [
            'title' => 'ইশার নামাজের সময় হয়েছে 🌙',
            'body' => 'ইশার নামাজের ওয়াক্ত শুরু হয়েছে। জামায়াতে নামাজ ও রাতের বিতর সালাত আদায় করুন।',
        ],
    ];

    // On Fridays the Dhuhr waqt is prayed as Jumu'ah (same as withJumuah() in locationService.js)
    public const JUMUAH = [
        'title' => 'জুমার নামাজের সময় হয়েছে 🕌',
        'body' => 'গোসল করে পরিচ্ছন্ন পোশাক ও সুগন্ধি নিয়ে আগে আগে মসজিদে যান। মনোযোগ দিয়ে খুতবা শুনুন।',
    ];

    /**
     * Notification text for a prayer on the given day.
     *
     * @return array{title:string, body:string}
     */
    public static function notificationFor(string $id, CarbonInterface $date): array
    {
        return $id === 'dhuhr' && $date->isFriday() ? self::JUMUAH : self::PRAYERS[$id];
    }

    /**
     * @param  CarbonInterface  $date  A date in the device's own timezone.
     * @return array<string, array{hour:int, minute:int}>
     */
    public static function calculate(float $lat, float $lng, CarbonInterface $date): array
    {
        $tz = $date->getOffset() / 3600;
        $gamma = (2 * M_PI / 365) * ($date->dayOfYear - 1);

        $eqtime = 229.18 * (
            0.000075
            + 0.001868 * cos($gamma)
            - 0.032077 * sin($gamma)
            - 0.014615 * cos(2 * $gamma)
            - 0.040849 * sin(2 * $gamma)
        );

        $decl = 0.006918
            - 0.399912 * cos($gamma)
            + 0.070257 * sin($gamma)
            - 0.006758 * cos(2 * $gamma)
            + 0.000907 * sin(2 * $gamma)
            - 0.002697 * cos(3 * $gamma)
            + 0.00148 * sin(3 * $gamma);

        $solarNoon = 12 - ($eqtime + 4 * $lng - 60 * $tz) / 60;
        $latRad = deg2rad($lat);

        $hourAngle = function (float $angleDeg) use ($latRad, $decl): ?float {
            $cosHA = (sin(deg2rad($angleDeg)) - sin($latRad) * sin($decl)) / (cos($latRad) * cos($decl));
            if ($cosHA > 1 || $cosHA < -1) {
                return null; // Extreme latitudes
            }

            return rad2deg(acos($cosHA));
        };

        $asrAngle = rad2deg(atan(1 / (2 + tan(abs($latRad - $decl)))));

        $times = [
            'fajr' => $solarNoon - ($hourAngle(-18) ?? 108) / 15,
            'dhuhr' => $solarNoon + 2 / 60,
            'asr' => $solarNoon + ($hourAngle($asrAngle) ?? 55) / 15,
            'maghrib' => $solarNoon + ($hourAngle(-0.833) ?? 90) / 15 + 2 / 60,
            'isha' => $solarNoon + ($hourAngle(-18) ?? 108) / 15,
        ];

        return array_map(function (float $t) {
            $t = fmod($t + 24, 24);
            $hour = (int) floor($t);

            return ['hour' => $hour, 'minute' => (int) floor(($t - $hour) * 60)];
        }, $times);
    }
}
