@extends('admin.layouts.app')

@section('content')
<div class="container-fluid py-4">
    <div class="mb-4">
        <h1 class="h3 mb-1">Add New Dua</h1>
        <span class="text-muted">Provide the dua details</span>
    </div>

    @if ($errors->any())
        <div class="alert alert-danger">
            <strong>Validation failed:</strong>
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="card">
        <div class="card-body">
            <form action="{{ route('admin.duas.store', [], false) }}" method="POST">
                @csrf
                @include('admin.duas._form')
                <div class="mt-4">
                    <button type="submit" class="btn btn-primary">Save Dua</button>
                    <a href="{{ route('admin.duas.index', [], false) }}" class="btn btn-outline-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
