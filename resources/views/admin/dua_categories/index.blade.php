@extends('admin.layouts.app')

@section('page_title', 'Dua Categories')
@section('page_subtitle', 'Group duas by theme and manage sort order for the frontend experience.')

@section('content')
<div
    class="admin-card"
    data-admin-table="dua-categories"
    data-endpoint="{{ route('admin.dua-categories.index') }}"
    data-create-endpoint="{{ route('admin.dua-categories.create') }}"
    data-store-endpoint="{{ route('admin.dua-categories.store') }}"
    data-edit-template="{{ url('admin/dua-categories/__ID__/edit') }}"
    data-update-template="{{ url('admin/dua-categories/__ID__') }}"
    data-delete-template="{{ url('admin/dua-categories/__ID__') }}"
>
    <div class="admin-table-shell">
        <div class="table-controls">
            <div class="controls-left">
                <h2 class="controls-title">Dua Categories</h2>
                <p class="controls-description">Fine tune the sort order and visibility of dua categories in one place.</p>
            </div>
            <div class="controls-right">
                <label class="search-field">
                    <i class="bi bi-search"></i>
                    <input type="search" placeholder="Search categories..." data-admin-search>
                </label>
                <label class="select-field" data-admin-filter="is_active">
                    <span>Status</span>
                    <select data-admin-filter-select>
                        <option value="">All</option>
                        <option value="1">Active</option>
                        <option value="0">Hidden</option>
                    </select>
                </label>
                <button type="button" class="btn-primary" data-admin-create>
                    <i class="bi bi-plus-lg"></i>
                    <span>New Category</span>
                </button>
            </div>
        </div>

        <div class="table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Duas</th>
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
