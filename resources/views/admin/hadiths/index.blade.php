@extends('admin.layouts.app')

@section('content')
<div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h1 class="h3 mb-1">Hadith Entries</h1>
            <span class="text-muted">Manage the hadith library shown in the app</span>
        </div>
        <a href="{{ route('admin.hadiths.create') }}" class="btn btn-primary">Add Hadith</a>
    </div>

    @if (session('status'))
        <div class="alert alert-success">{{ session('status') }}</div>
    @endif

    <div class="card">
        <div class="table-responsive">
            <table class="table table-striped mb-0 align-middle">
                <thead>
                    <tr>
                        <th style="width:60px;">#</th>
                        <th>Title</th>
                        <th style="width:25%;">Reference</th>
                        <th style="width:100px;">Visible</th>
                        <th class="text-end" style="width:160px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($hadiths as $hadith)
                        <tr>
                            <td>{{ $hadith->id }}</td>
                            <td class="text-truncate" style="max-width:360px;">{{ $hadith->title }}</td>
                            <td>{{ $hadith->reference ?: '-' }}</td>
                            <td>{{ $hadith->is_active ? 'Yes' : 'No' }}</td>
                            <td class="text-end">
                                <div class="btn-group">
                                    <a href="{{ route('admin.hadiths.edit', $hadith) }}" class="btn btn-sm btn-outline-secondary">Edit</a>
                                    <form action="{{ route('admin.hadiths.destroy', $hadith) }}" method="POST" onsubmit="return confirm('Delete this hadith?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-sm btn-outline-danger">Delete</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center py-4">No hadith entries yet.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="card-footer">
            {{ $hadiths->links() }}
        </div>
    </div>
</div>
@endsection

