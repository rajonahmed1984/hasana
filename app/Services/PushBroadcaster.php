<?php

namespace App\Services;

use App\Models\DeviceToken;

/**
 * Sends one push notification to every active device (optionally only one platform).
 */
class PushBroadcaster
{
    /**
     * @return array{sent:int, total:int}
     */
    public static function send(string $title, string $body, string $url = '/', ?string $platform = null): array
    {
        $query = DeviceToken::where('is_active', true);
        if ($platform) {
            $query->where('platform', $platform);
        }

        $total = $query->count();
        if ($total === 0 || ! FcmSender::isConfigured()) {
            return ['sent' => 0, 'total' => $total];
        }

        $sender = app(FcmSender::class);
        $sent = 0;
        $tag = 'broadcast-'.now()->timestamp;

        $query->chunkById(200, function ($devices) use ($sender, $title, $body, $url, $tag, &$sent) {
            foreach ($devices as $device) {
                $result = $sender->send($device->token, $device->platform, $title, $body, [
                    'type' => 'broadcast',
                    'tag' => $tag,
                    'url' => $url,
                ]);

                if ($result === FcmSender::OK) {
                    $sent++;
                } elseif ($result === FcmSender::INVALID_TOKEN) {
                    $device->update(['is_active' => false]);
                }
            }
        });

        return ['sent' => $sent, 'total' => $total];
    }
}
