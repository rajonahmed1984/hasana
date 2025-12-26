@extends('admin.layouts.app')

@section('title', 'Settings')

@section('content')
<div class="admin-content">
    <div class="content-header">
        <h1>Settings</h1>
    </div>

    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <div class="card">
        <div class="card-header">
            <h3>General Settings</h3>
        </div>
        <div class="card-body">
            <form method="POST" action="{{ route('admin.settings.update') }}" enctype="multipart/form-data">
                @csrf
                @method('PUT')

                <div class="form-group mb-3">
                    <label for="site_name" class="form-label">Site Name</label>
                    <input type="text" class="form-control" id="site_name" name="site_name" value="{{ old('site_name', $settings['site_name']) }}">
                    @error('site_name')
                        <div class="text-danger">{{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group mb-3">
                    <label for="logo" class="form-label">Logo</label>
                    <div class="mb-2">
                        <img src="{{ logo_url() }}" alt="Current Logo" style="max-height: 60px;">
                    </div>
                    <input type="file" class="form-control" id="logo" name="logo" accept="image/svg+xml,image/png,image/jpeg,image/jpg">
                    <small class="form-text text-muted">Accepted formats: SVG, PNG, JPG, JPEG. Max size: 2MB</small>
                    @error('logo')
                        <div class="text-danger">{{ $message }}</div>
                    @enderror
                </div>

                <button type="submit" class="btn btn-primary">Save Settings</button>
            </form>
        </div>
    </div>
</div>

<style>
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
.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin-bottom: 1.5rem;
}
.card-header {
    padding: 1.25rem;
    border-bottom: 1px solid #e9ecef;
}
.card-header h3 {
    margin: 0;
    font-size: 1.25rem;
}
.card-body {
    padding: 1.25rem;
}
.form-group {
    margin-bottom: 1rem;
}
.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
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
}
.btn {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;
}
.btn-primary {
    color: #fff;
    background-color: #0d6efd;
}
.btn-primary:hover {
    background-color: #0b5ed7;
}
.text-danger {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}
.text-muted {
    color: #6c757d;
}
</style>
@endsection
