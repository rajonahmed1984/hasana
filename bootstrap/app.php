<?php

use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\LogSuspiciousActivity;
use App\Http\Middleware\SetLocale; // <-- import it
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\Auth;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Register globally for all web routes
        $middleware->web(append: [
            SetLocale::class,
            SecurityHeaders::class,
            LogSuspiciousActivity::class,
        ]);

        // Redirect guests to the admin login so Laravel's default auth helpers work.
        $middleware->redirectGuestsTo(fn () => route('admin.login'));
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (TokenMismatchException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Your session has expired. Please refresh and try again.',
                ], 419);
            }

            Auth::logout();

            return redirect()
                ->route('admin.login')
                ->with('status', 'Your session expired. Please sign in again.');
        });
    })->create();
