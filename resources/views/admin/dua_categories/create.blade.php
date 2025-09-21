@extends('admin.layouts.app')

@section('content')
<div class="container-fluid py-4">
    <div class="mb-4">
        <h1 class="h3 mb-1">Add Dua Category</h1>
        <span class="text-muted">Organise duas into the tabs shown on the dua page</span>
    </div>

    @if ($errors->any())
        <div class="alert alert-danger">
            <strong>Validation failed:</strong>
            <ul class="mb-0">
                @foreach ($errors->all() as $message)
                    <li>{{ $message }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="card">
        <div class="card-body">
            <form action="{{ route('admin.dua-categories.store', [], false) }}" method="POST">
                @csrf
                @include('admin.dua_categories._form')
                <div class="mt-4">
                    <button type="submit" class="btn btn-primary">Save Category</button>
                    <a href="{{ route('admin.dua-categories.index', [], false) }}" class="btn btn-outline-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
