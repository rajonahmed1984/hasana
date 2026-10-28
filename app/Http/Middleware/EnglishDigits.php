<?php

namespace App\Http\Middleware;

use Closure;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Converts Bengali digits (০-৯) to English digits (0-9) in HTML and JSON responses,
 * so numbers coming from the database are shown in English as well.
 */
class EnglishDigits
{
    private const BN = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    private const EN = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    public function handle($request, Closure $next)
    {
        $response = $next($request);

        if ($response instanceof BinaryFileResponse || $response instanceof StreamedResponse) {
            return $response;
        }

        $type = (string) $response->headers->get('Content-Type', '');
        if ($type !== '' && ! str_contains($type, 'json') && ! str_contains($type, 'html')) {
            return $response;
        }

        $content = $response->getContent();
        if (is_string($content) && $content !== '') {
            // JSON responses escape unicode by default, e.g. "\u09e7" for 1.
            $escaped = array_map(fn ($hex) => "\u09e$hex", ['6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']);
            $content = str_ireplace($escaped, self::EN, $content);
            $response->setContent(str_replace(self::BN, self::EN, $content));
        }

        return $response;
    }
}
