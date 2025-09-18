@extends('layouts.app')

@section('content')
<div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h1 class="h3 mb-1">Ayahs · {{ $surah->name_en }}</h1>
            <span class="text-muted">Manage verses line by line</span>
        </div>
        <div class="btn-group">
            <a href="{{ route('admin.hasana.surahs.edit', $surah) }}" class="btn btn-outline-secondary">Back to Surah</a>
            <a href="{{ route('admin.hasana.surahs.ayahs.create', $surah) }}" class="btn btn-primary">Add Ayah</a>
        </div>
    </div>

    @if (session('status'))
        <div class="alert alert-success">{{ session('status') }}</div>
    @endif

    <div class="card">
        <div class="table-responsive">
            <table class="table table-striped mb-0 align-middle">
                <thead>
                    <tr>
                        <th style="width: 70px;">#</th>
                        <th style="width: 35%;">Arabic</th>
                        <th style="width: 35%;">English</th>
                        <th>Active</th>
                        <th class="text-end" style="width: 150px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($ayahs as $ayah)
                        <tr>
                            <td>{{ $ayah->number }}</td>
                            <td class="text-truncate" style="max-width: 320px;">{{ $ayah->text_ar }}</td>
                            <td class="text-truncate" style="max-width: 320px;">{{ $ayah->text_en }}</td>
                            <td>{{ $ayah->is_active ? 'Yes' : 'No' }}</td>
                            <td class="text-end">
                                <div class="btn-group">
                                    <a href="{{ route('admin.hasana.surahs.ayahs.edit', [$surah, $ayah]) }}" class="btn btn-sm btn-outline-secondary">Edit</a>
                                    <form action="{{ route('admin.hasana.surahs.ayahs.destroy', [$surah, $ayah]) }}" method="POST" onsubmit="return confirm('Delete this ayah?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-sm btn-outline-danger">Delete</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center py-4">No ayahs yet.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="card-footer">
            {{ $ayahs->links() }}
        </div>
    </div>
</div>
@endsection
