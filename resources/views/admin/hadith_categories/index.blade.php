@extends('admin.layouts.app')

@section('content')
<div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h1 class="h3 mb-1">Hadith Collections</h1>
            <span class="text-muted">Control the tabs and grouping on the hadith page</span>
        </div>
        <a href="{{ route('admin.hadith-categories.create') }}" class="btn btn-primary">New Collection</a>
    </div>

    @if (session('status'))
        <div class="alert alert-success">{{ session('status') }}</div>
    @endif

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $message)
                    <li>{{ $message }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="card">
        <div class="table-responsive">
            <table class="table table-striped mb-0 align-middle">
                <thead>
                    <tr>
                        <th style="width:60px;">#</th>
                        <th>Name</th>
                        <th style="width:20%;">Slug</th>
                        <th style="width:120px;">Hadiths</th>
                        <th style="width:120px;">Order</th>
                        <th style="width:100px;">Active</th>
                        <th class="text-end" style="width:160px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($categories as $category)
                        <tr>
                            <td>{{ $category->id }}</td>
                            <td>{{ $category->name }}</td>
                            <td>{{ $category->slug }}</td>
                            <td>{{ $category->hadiths_count }}</td>
                            <td>{{ $category->sort_order }}</td>
                            <td>{{ $category->is_active ? 'Yes' : 'No' }}</td>
                            <td class="text-end">
                                <div class="btn-group">
                                    <a href="{{ route('admin.hadith-categories.edit', $category) }}" class="btn btn-sm btn-outline-secondary">Edit</a>
                                    <form action="{{ route('admin.hadith-categories.destroy', $category) }}" method="POST" onsubmit="return confirm('Delete this collection?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-sm btn-outline-danger">Delete</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center py-4">No collections yet.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="card-footer">
            {{ $categories->links() }}
        </div>
    </div>
</div>
@endsection
