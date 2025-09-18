<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hasana Admin Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"/>
    <link rel="stylesheet" href="{{ asset('assets/auth-style.css') }}">
</head>
<body class="bg-light">
    <div class="auth-container">
        <div class="auth-card card shadow-lg border-0">
            <div class="card-body">
                <div class="auth-header text-center mb-4">
                    <img src="{{ asset('assets/logo.png') }}" alt="Hasana" class="logo mb-3">
                    <h1 class="h4 mb-1">Sign in to Hasana Admin</h1>
                    <p class="text-muted mb-0">Use your account to manage surahs and ayahs.</p>
                </div>

                <form id="loginForm" method="POST" action="{{ route('login') }}">
                    @csrf
                    <div class="form-floating mb-3">
                        <input type="email" name="email" value="{{ old('email') }}" class="form-control" id="email" placeholder="name@example.com" required>
                        <label for="email">Email address</label>
                        @error('email')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>

                    <div class="form-floating mb-4">
                        <input type="password" name="password" class="form-control" id="password" placeholder="Password" required>
                        <label for="password">Password</label>
                        @error('password')
                            <span class="invalid-feedback d-block" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>

                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="remember" id="rememberMe" {{ old('remember') ? 'checked' : '' }}>
                            <label class="form-check-label" for="rememberMe">
                                Remember me
                            </label>
                        </div>
                        @if (Route::has('password.request'))
                            <a href="{{ route('password.request') }}" class="forgot-password-link">Forgot password?</a>
                        @endif
                    </div>

                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary btn-lg">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
