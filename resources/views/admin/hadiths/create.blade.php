@extends('admin.layouts.app')

@section('content')
<div class="container-fluid py-4">
    <div class="mb-4">
        <h1 class="h3 mb-1">Add New Hadith</h1>
        <span class="text-muted">Provide the text and reference information</span>
    </div>

    @if (->any())
        <div class="alert alert-danger">
            <strong>Validation failed:</strong>
            <ul class="mb-0">
                @foreach (->all() as )
                    <li>{{  }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="card">
        <div class="card-body">
            <form action="{{ route('admin.hadiths.store') }}" method="POST">
                @csrf
                @include('admin.hadiths._form')
                <div class="mt-4">
                    <button type="submit" class="btn btn-primary">Save Hadith</button>
                    <a href="{{ route('admin.hadiths.index') }}" class="btn btn-outline-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
