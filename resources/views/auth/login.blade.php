<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>লগইন - eBUSI</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"/>
    <!-- Custom Auth CSS -->
    <link rel="stylesheet" href="{{ asset('assets/auth-style.css')}}">
</head>
<body>

    <div class="auth-container">
        <div class="auth-card card shadow-lg">
            <div class="card-body">
                <div class="auth-header">
                    <img src="{{ asset('assets/logo.png')}}" alt="eBUSI Logo" class="logo">
                    <h1 class="h3">আপনার অ্যাকাউন্টে লগইন করুন</h1>
                    <p class="text-muted mb-0">স্বাগতম!</p>
                </div>

                <div class="auth-body">
                    <form id="loginForm" method="POST" action="{{ route('login') }}">
                        @csrf
                        <!-- Email Address -->
                        <div class="form-floating mb-3">
                            <input type="email" name="email" value="{{ old('email')}}" class="form-control" id="email" placeholder="name@example.com" required>
                            <label for="email">ইমেইল অ্যাড্রেস</label>
                            @error('email')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>

                        <!-- Password -->
                        <div class="form-floating mb-4">
                            <input type="password" name="password" class="form-control" id="password" placeholder="Password" required>
                            <label for="password">পাসওয়ার্ড</label>
                            @error('email')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>

                        <!-- Remember Me & Forgot Password -->
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div class="form-check">

                                <input class="form-check-input" type="checkbox" name="remember" id="rememberMe" {{ old('remember') ? 'checked' : '' }}>

                                <label class="form-check-label" for="rememberMe">
                                    মনে রাখুন
                                </label>
                            </div>
                            <a href="{{ route('password.request') }}" class="forgot-password-link">পাসওয়ার্ড ভুলে গেছেন?</a>
                        </div>
                        
                        <!-- Submit Button -->
                        <div class="d-grid">
                            <button type="submit" class="btn btn-primary btn-lg">লগইন করুন</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

</body>
</html>
