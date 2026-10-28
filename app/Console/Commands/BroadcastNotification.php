<?php

namespace App\Console\Commands;

use App\Models\DeviceToken;
use App\Services\FcmSender;
use App\Services\PushBroadcaster;
use Illuminate\Console\Command;

/**
 * Sends a one-off announcement push to every registered device (web + app).
 * Example: php artisan notifications:broadcast "রমজান মোবারক" "সবাইকে রমজানের শুভেচ্ছা" --url=/
 */
class BroadcastNotification extends Command
{
    protected $signature = 'notifications:broadcast
        {title : Notification title}
        {body : Notification body}
        {--url=/ : Page to open when tapped}
        {--platform= : Only send to web, android or ios}';

    protected $description = 'Send a push notification to all active devices';

    public function handle(): int
    {
        if (! FcmSender::isConfigured()) {
            $this->error('FCM is not configured (set FIREBASE_CREDENTIALS).');

            return self::FAILURE;
        }

        $platform = $this->option('platform') ?: null;
        $total = DeviceToken::where('is_active', true)
            ->when($platform, fn ($q) => $q->where('platform', $platform))
            ->count();

        if (! $this->confirm("Send to {$total} device(s)?", true)) {
            return self::SUCCESS;
        }

        $result = PushBroadcaster::send($this->argument('title'), $this->argument('body'), $this->option('url'), $platform);
        $this->info("Sent to {$result['sent']} of {$result['total']} device(s).");

        return self::SUCCESS;
    }
}
