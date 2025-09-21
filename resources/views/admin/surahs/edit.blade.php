@extends('admin.layouts.app')

@section('content')
<div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h1 class="h3 mb-1">Edit Surah - {{ $surah->name_en }}</h1>
            <span class="text-muted">Manage core info and ayahs</span>
        </div>
        <div class="btn-group">
            <a href="{{ route('admin.surahs.index', [], false) }}" class="btn btn-outline-secondary">All Surahs</a>
            <a href="{{ route('admin.surahs.ayahs.index', $surah, false) }}" class="btn btn-primary">Manage Ayahs</a>
        </div>
    </div>

    @if (session('status'))
        <div class="alert alert-success">{{ session('status') }}</div>
    @endif

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

    <div class="card mb-4">
        <div class="card-body">
            <form action="{{ route('admin.surahs.update', $surah, false) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.surahs._form')

                <div class="d-flex justify-content-end mt-4">
                    <button type="submit" class="btn btn-primary">Update Surah</button>
                </div>
            </form>
        </div>
    </div>

    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h2 class="h5 mb-0">Ayahs snapshot</h2>
            <a href="{{ route('admin.surahs.ayahs.create', $surah, false) }}" class="btn btn-sm btn-outline-primary">Add Ayah</a>
        </div>
        <div class="table-responsive">
            <table class="table table-sm table-striped mb-0">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Bangla Translation</th>
                        <th>Bangla Pronunciation</th>
                        <th>Arabic</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($surah->ayahs->take(10) as $ayah)
                        <tr>
                            <td>{{ $ayah->number }}</td>
                            <td class="text-truncate" style="max-width: 240px;">{{ $ayah->text_bn ?: '-' }}</td>
                            <td class="text-truncate" style="max-width: 240px;">{{ $ayah->transliteration ?: '-' }}</td>
                            <td class="text-truncate" style="max-width: 240px;">{{ $ayah->text_ar ?: '-' }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="text-center py-3">No ayahs yet. Add one to get started.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
