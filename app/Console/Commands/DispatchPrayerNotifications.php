<?php

namespace App\Console\Commands;

use App\Models\DeviceToken;
use App\Services\DailyAyah;
use App\Services\FcmSender;
use App\Services\PrayerTimes;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

/**
 * Sends prayer time and daily ayah push notifications to web devices.
 * Runs every minute from the scheduler. The Android app schedules these
 * itself with local notifications, so only web tokens are handled here.
 */
class DispatchPrayerNotifications extends Command
{
    protected $signature = 'notifications:dispatch {--dry-run : Show what would be sent without sending}';

    protected $description = 'Send due prayer time and daily ayah push notifications';

    // If the scheduler misses a run, still send within this many minutes of the prayer time
    private const GRACE_MINUTES = 10;

    private const AYAH_HOUR = 8;

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        if (! $dryRun && ! FcmSender::isConfigured()) {
            $this->warn('FCM is not configured (set FIREBASE_CREDENTIALS). Skipping.');

            return self::SUCCESS;
        }

        $sender = $dryRun ? null : app(FcmSender::class);
        $ayahCache = [];
        $sent = 0;

        DeviceToken::query()
            ->where('is_active', true)
            ->where('platform', 'web')
            ->where(fn ($q) => $q->where('prayer_enabled', true)->orWhere('ayah_enabled', true))
            ->chunkById(200, function ($devices) use ($sender, $dryRun, &$ayahCache, &$sent) {
                foreach ($devices as $device) {
                    foreach ($this->dueNotifications($device, $ayahCache) as $key => $notification) {
                        if ($dryRun) {
                            $this->line("[dry-run] #{$device->id} {$key}: {$notification['title']}");
                            continue;
                        }

                        $result = $sender->send($device->token, $device->platform, $notification['title'], $notification['body'], $notification['data']);

                        if ($result === FcmSender::INVALID_TOKEN) {
                            $device->update(['is_active' => false]);
                            break;
                        }

                        if ($result === FcmSender::OK) {
                            $sent++;
                            $log = $device->last_notified ?? [];
                            $log[$key] = $notification['data']['date'];
                            $device->last_notified = $log;
                            $device->save();
                        }
                    }
                }
            });

        $this->info("Sent {$sent} notification(s).");

        return self::SUCCESS;
    }

    /**
     * @return array<string, array{title:string, body:string, data:array}>
     */
    private function dueNotifications(DeviceToken $device, array &$ayahCache): array
    {
        $tz = $device->timezone ?: 'Asia/Dhaka';
        $now = Carbon::now($tz);
        $today = $now->toDateString();
        $log = $device->last_notified ?? [];
        $due = [];

        $isDue = function (int $hour, int $minute) use ($now): bool {
            $at = $now->copy()->setTime($hour, $minute);

            return $now->gte($at) && $now->lt($at->copy()->addMinutes(self::GRACE_MINUTES));
        };

        if ($device->prayer_enabled && $device->latitude !== null && $device->longitude !== null) {
            $prefs = $device->prayer_prefs ?? [];
            $times = PrayerTimes::calculate((float) $device->latitude, (float) $device->longitude, $now);

            foreach ($times as $id => $time) {
                if (($prefs[$id] ?? true) === false || ($log[$id] ?? null) === $today) {
                    continue;
                }

                if ($isDue($time['hour'], $time['minute'])) {
                    $text = PrayerTimes::notificationFor($id, $now);
                    $due[$id] = [
                        'title' => $text['title'],
                        'body' => $text['body'],
                        'data' => ['type' => 'prayer', 'prayer' => $id, 'date' => $today, 'tag' => "namaz-{$id}-{$today}", 'url' => '/'],
                    ];
                }
            }
        }

        if ($device->ayah_enabled && ($log['ayah'] ?? null) !== $today && $isDue(self::AYAH_HOUR, 0)) {
            $ayah = $ayahCache[$today] ??= DailyAyah::forDate($now);

            $due['ayah'] = [
                'title' => "আজকের দিনের আয়াত 📖 ({$ayah['surah_name']})",
                'body' => "{$ayah['text_bn']}\n— {$ayah['reference']}",
                'data' => ['type' => 'daily_ayah', 'date' => $today, 'tag' => "daily-ayah-{$today}", 'url' => $ayah['deep_link']],
            ];
        }

        return $due;
    }
}
