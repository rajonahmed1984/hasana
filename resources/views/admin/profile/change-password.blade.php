@extends('admin.layouts.app')

@section('title', 'Change Password')

@section('content')
<div class="admin-content">
    <div class="content-header">
        <h1>Change Password</h1>
    </div>

    @if($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="card">
        <div class="card-header">
            <h3>Update Your Password</h3>
        </div>
        <div class="card-body">
            <form method="POST" action="{{ route('admin.profile.update-password') }}">
                @csrf
                @method('PUT')

                <div class="form-group">
                    <label for="current_password" class="form-label">Current Password</label>
                    <input type="password" class="form-control" id="current_password" name="current_password" required>
                    @error('current_password')
                        <div class="text-danger">{{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">New Password</label>
                    <input type="password" class="form-control" id="password" name="password" required>
                    <small class="form-text">Minimum 8 characters</small>
                    @error('password')
                        <div class="text-danger">{{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="password_confirmation" class="form-label">Confirm New Password</label>
                    <input type="password" class="form-control" id="password_confirmation" name="password_confirmation" required>
                    @error('password_confirmation')
                        <div class="text-danger">{{ $message }}</div>
                    @enderror
                </div>

                <div class="action-buttons">
                    <button type="submit" class="btn btn-primary">Change Password</button>
                    <a href="{{ route('admin.profile.show') }}" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    overflow: hidden;
    max-width: 500px;
}

.card-header {
    padding: 1.25rem;
    border-bottom: 1px solid #e9ecef;
    background-color: #f8f9fa;
}

.card-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #212529;
}

.card-body {
    padding: 1.25rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #212529;
}

.form-control {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #212529;
    background-color: #fff;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    box-sizing: border-box;
}

.form-control:focus {
    border-color: #0d6efd;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.form-text {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: #6c757d;
}

.action-buttons {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e9ecef;
}

.btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
}

.btn-primary {
    color: #fff;
    background-color: #0d6efd;
}

.btn-primary:hover {
    background-color: #0b5ed7;
}

.btn-secondary {
    color: #fff;
    background-color: #6c757d;
}

.btn-secondary:hover {
    background-color: #5c636a;
}

.alert {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.25rem;
}

.alert-danger {
    color: #842029;
    background-color: #f8d7da;
    border: 1px solid #f5c2c7;
}

.alert-danger ul {
    margin: 0;
    padding-left: 1.5rem;
}

.alert-danger li {
    margin-bottom: 0.25rem;
}

.text-danger {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
}

.content-header {
    margin-bottom: 1.5rem;
}

.content-header h1 {
    margin: 0;
    font-size: 1.75rem;
    color: #212529;
}
</style>
@endsection
