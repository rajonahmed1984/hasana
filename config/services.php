<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // Firebase Cloud Messaging: path to the service account JSON (Firebase console → Project settings → Service accounts)
    'fcm' => [
        'credentials' => env('FIREBASE_CREDENTIALS', storage_path('app/private/firebase-credentials.json')),
    ],

    // Claude: understands Explore (জানুন) questions and ranks the matching texts. Empty key = keyword search only.
    'anthropic' => [
        'key' => env('ANTHROPIC_API_KEY'),
        'model' => env('HASANA_AI_MODEL', 'claude-opus-5-5'),
    ],

];
