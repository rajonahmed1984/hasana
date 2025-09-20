@extends('admin.layouts.app')

@section('page_title', 'Hadith Entries')
@section('page_subtitle', 'Organise collections, edit narrations, and keep the library fresh.')

@section('content')
<div
    class="admin-card"
    data-admin-table="hadiths"
    data-endpoint="{{ route('admin.hadiths.index') }}"
    data-create-endpoint="{{ route('admin.hadiths.create') }}"
    data-store-endpoint="{{ route('admin.hadiths.store') }}"
    data-edit-template="{{ url('admin/hadiths/__ID__/edit') }}"
    data-update-template="{{ url('admin/hadiths/__ID__') }}"
    data-delete-template="{{ url('admin/hadiths/__ID__') }}"
>
    <div class="admin-table-shell">
        <div class="table-controls">
            <div class="controls-left">
                <h2 class="controls-title">Hadith Library</h2>
                <p class="controls-description">Quickly filter by collection or status and edit narrations without page reloads.</p>
            </div>
            <div class="controls-right">
                <div class="control-group">
                    <label class="select-field" data-admin-filter="category">
                        <span>Collection</span>
                        <select data-admin-filter-select>
                            <option value="">All</option>
                        </select>
                    </label>
                    <label class="select-field" data-admin-filter="is_active">
                        <span>Status</span>
                        <select data-admin-filter-select>
                            <option value="">All</option>
                            <option value="1">Active</option>
                            <option value="0">Hidden</option>
                        </select>
                    </label>
                </div>
                <label class="search-field">
                    <i class="bi bi-search"></i>
                    <input type="search" placeholder="Search hadith narrations..." data-admin-search>
                </label>
                <button type="button" class="btn-primary" data-admin-create>
                    <i class="bi bi-plus-lg"></i>
                    <span>New Hadith</span>
                </button>
            </div>
        </div>

        <div class="table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Collection</th>
                        <th>Reference</th>
                        <th>Status</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody data-admin-tbody>
                    <tr class="table-empty">
                        <td colspan="6">Loading records...</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="table-footer">
            <div class="table-info" data-admin-table-info></div>
            <nav class="pagination" data-admin-pagination></nav>
        </div>
    </div>
</div>
@endsection
