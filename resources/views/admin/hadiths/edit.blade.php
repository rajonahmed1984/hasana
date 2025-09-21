@extends('admin.layouts.app')

@section('content')
<div class="container-fluid py-4">
    <div class="mb-4">
        <h1 class="h3 mb-1">Edit Hadith</h1>
        <span class="text-muted">Update the selected entry</span>
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
            <form action="{{ route('admin.hadiths.update', $hadith, false) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.hadiths._form')
                <div class="mt-4">
                    <button type="submit" class="btn btn-primary">Update Hadith</button>
                    <a href="{{ route('admin.hadiths.index', [], false) }}" class="btn btn-outline-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
