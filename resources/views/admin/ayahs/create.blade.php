@extends('admin.layouts.app')

@section('content')
<div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">Add Ayah - {{ $surah->name_en }}</h1>
        <a href="{{ route('admin.surahs.ayahs.index', $surah) }}" class="btn btn-outline-secondary">Cancel</a>
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
            <form action="{{ route('admin.surahs.ayahs.store', $surah) }}" method="POST">
                @csrf
                @include('admin.ayahs._form')

                <div class="d-flex justify-content-end mt-4">
                    <button type="submit" class="btn btn-primary">Save Ayah</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
