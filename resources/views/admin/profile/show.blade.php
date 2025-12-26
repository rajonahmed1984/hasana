@extends('admin.layouts.app')

@section('title', 'My Profile')

@section('content')
<div class="admin-content">
    <div class="content-header">
        <h1>My Profile</h1>
    </div>

    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <div class="profile-cards">
        <div class="card">
            <div class="card-header">
                <h3>Profile Information</h3>
            </div>
            <div class="card-body">
                <div class="info-row">
                    <label>Name:</label>
                    <span>{{ $user->name }}</span>
                </div>
                <div class="info-row">
                    <label>Email:</label>
                    <span>{{ $user->email }}</span>
                </div>
                <div class="info-row">
                    <label>Member Since:</label>
                    <span>{{ $user->created_at->format('M d, Y') }}</span>
                </div>
                <div class="action-buttons">
                    <a href="{{ route('admin.profile.edit') }}" class="btn btn-primary">Edit Profile</a>
                    <a href="{{ route('admin.profile.change-password') }}" class="btn btn-secondary">Change Password</a>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.profile-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 1.5rem;
}

.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    overflow: hidden;
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

.info-row {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e9ecef;
}

.info-row:last-of-type {
    border-bottom: none;
}

.info-row label {
    font-weight: 600;
    color: #495057;
}

.info-row span {
    color: #212529;
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

.alert-success {
    color: #0f5132;
    background-color: #d1e7dd;
    border: 1px solid #badbcc;
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
