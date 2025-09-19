@extends('admin.layouts.app')

@section('content')
<div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">Hasana - Surahs</h1>
        <a href="{{ route('admin.surahs.create') }}" class="btn btn-primary">New Surah</a>
    </div>

    @if (session('status'))
        <div class="alert alert-success">{{ session('status') }}</div>
    @endif

    <div class="card">
        <div class="table-responsive">
            <table class="table table-striped mb-0">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name (Arabic)</th>
                        <th>Name (English)</th>
                        <th>Name (বাংলা)</th>
                        <th>Revelation</th>
                        <th>Ayahs</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($surahs as $surah)
                        <tr>
                            <td>{{ $surah->number }}</td>
                            <td>{{ $surah->name_ar }}</td>
                            <td>{{ $surah->name_en }}</td>
                            <td>{{ data_get($surah->meta, 'name_bn', '-') }}</td>
                            <td>{{ $surah->revelation_type ?? '—' }}</td>
                            <td>{{ $surah->ayah_count }}</td>
                            <td class="text-end">
                                <div class="btn-group" role="group">
                                    <a href="{{ route('admin.surahs.edit', $surah) }}" class="btn btn-sm btn-outline-secondary">Edit</a>
                                    <a href="{{ route('admin.surahs.ayahs.index', $surah) }}" class="btn btn-sm btn-outline-primary">Ayahs</a>
                                    <form action="{{ route('admin.surahs.destroy', $surah) }}" method="POST" onsubmit="return confirm('Delete this surah?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-sm btn-outline-danger">Delete</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center py-4">No surahs yet.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="card-footer">
            {{ $surahs->links() }}
        </div>
    </div>
</div>
@endsection




