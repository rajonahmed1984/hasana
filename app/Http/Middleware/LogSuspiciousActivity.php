<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogSuspiciousActivity
{
    /**
     * Suspicious patterns to detect
     */
    private array $suspiciousPatterns = [
        '/\.\.[\/\\\\]/', // Directory traversal
        '/<script[^>]*>.*?<\/script>/is', // XSS attempts
        '/union.*select/i', // SQL injection
        '/exec\s*\(/i', // Code execution
        '/eval\s*\(/i', // Code execution
        '/base64_decode/i', // Obfuscation
        '/system\s*\(/i', // System commands
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check for suspicious patterns in request
        $input = json_encode($request->all());
        $url = $request->fullUrl();
        
        foreach ($this->suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $input) || preg_match($pattern, $url)) {
                Log::warning('Suspicious activity detected', [
                    'ip' => $request->ip(),
                    'url' => $url,
                    'user_agent' => $request->userAgent(),
                    'input' => $request->all(),
                    'pattern' => $pattern,
                ]);
                
                // Optionally block the request
                // return response('Forbidden', 403);
            }
        }

        return $next($request);
    }
}
