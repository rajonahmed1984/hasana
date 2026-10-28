<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Minimal Firebase Cloud Messaging (HTTP v1) client using a service account JSON.
 */
class FcmSender
{
    public const OK = 'ok';
    public const INVALID_TOKEN = 'invalid';
    public const FAILED = 'failed';

    private array $credentials;

    public function __construct()
    {
        $path = config('services.fcm.credentials');
        if (! $path || ! is_file($path)) {
            throw new RuntimeException("FCM service account file not found: {$path}");
        }

        $this->credentials = json_decode(file_get_contents($path), true) ?: [];
        if (empty($this->credentials['private_key']) || empty($this->credentials['client_email'])) {
            throw new RuntimeException('FCM service account file is invalid.');
        }
    }

    public static function isConfigured(): bool
    {
        $path = config('services.fcm.credentials');

        return $path && is_file($path);
    }

    /**
     * Send one message. Web devices get a data-only message (the service worker shows it),
     * native devices get a regular notification message.
     */
    public function send(string $token, string $platform, string $title, string $body, array $data = []): string
    {
        $data = array_map('strval', array_merge($data, ['title' => $title, 'body' => $body]));

        $message = ['token' => $token, 'data' => $data];

        if ($platform === 'web') {
            $message['webpush'] = ['headers' => ['Urgency' => 'high', 'TTL' => '900']];
        } else {
            $message['notification'] = ['title' => $title, 'body' => $body];
            $message['android'] = [
                'priority' => 'high',
                'notification' => ['channel_id' => 'hasana-general', 'sound' => 'default'],
            ];
        }

        $response = Http::withToken($this->accessToken())
            ->timeout(15)
            ->post("https://fcm.googleapis.com/v1/projects/{$this->credentials['project_id']}/messages:send", [
                'message' => $message,
            ]);

        if ($response->successful()) {
            return self::OK;
        }

        $errorCode = $response->json('error.details.0.errorCode') ?? $response->json('error.status');
        if (in_array($errorCode, ['UNREGISTERED', 'INVALID_ARGUMENT', 'NOT_FOUND'], true)) {
            return self::INVALID_TOKEN;
        }

        Log::warning('FCM send failed', ['status' => $response->status(), 'body' => $response->body()]);

        return self::FAILED;
    }

    private function accessToken(): string
    {
        return Cache::remember('fcm-access-token', now()->addMinutes(50), function () {
            $now = time();
            $encode = fn (array $part) => rtrim(strtr(base64_encode(json_encode($part)), '+/', '-_'), '=');

            $unsigned = $encode(['alg' => 'RS256', 'typ' => 'JWT']).'.'.$encode([
                'iss' => $this->credentials['client_email'],
                'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
                'aud' => 'https://oauth2.googleapis.com/token',
                'iat' => $now,
                'exp' => $now + 3600,
            ]);

            openssl_sign($unsigned, $signature, $this->credentials['private_key'], OPENSSL_ALGO_SHA256);
            $jwt = $unsigned.'.'.rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');

            $response = Http::asForm()->timeout(15)->post('https://oauth2.googleapis.com/token', [
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion' => $jwt,
            ]);

            if (! $response->successful()) {
                throw new RuntimeException('FCM auth failed: '.$response->body());
            }

            return $response->json('access_token');
        });
    }
}
