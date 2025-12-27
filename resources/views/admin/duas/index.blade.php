@extends('admin.layouts.app')

@section('page_title', 'Duas')
@section('page_subtitle', 'Create themed dua collections and manage translations instantly.')

@section('content')
<div
    class="admin-card"
    data-admin-table="duas"
    data-endpoint="{{ route('admin.duas.index', [], false) }}"
    data-create-endpoint="{{ route('admin.duas.create', [], false) }}"
    data-store-endpoint="{{ route('admin.duas.store', [], false) }}"
    data-edit-template="{{ route('admin.duas.edit', ['dua' => '__ID__'], false) }}"
    data-update-template="{{ route('admin.duas.update', ['dua' => '__ID__'], false) }}"
    data-delete-template="{{ route('admin.duas.destroy', ['dua' => '__ID__'], false) }}"
>
    <div class="admin-table-shell">
        <div class="table-controls">
            <div class="controls-left">
                <h2 class="controls-title">Daily Duas</h2>
                <p class="controls-description">Keep supplications up to date with inline editing, translation toggles, and quick categorisation.</p>
            </div>
            <div class="controls-right">
                <div class="control-group">
                    <label class="select-field" data-admin-filter="category">
                        <span>Category</span>
                        <select data-admin-filter-select>
                            <option value="">All</option>
                        </select>
                    </label>
                    <label class="select-field" data-admin-filter="is_active">
                        <span>Status</span>
                        <select data-admin-filter-select>
                            <option value="">All</option>
                            <option value="1">Published</option>
                            <option value="0">Hidden</option>
                        </select>
                    </label>
                </div>
                <label class="search-field">
                    <i class="bi bi-search"></i>
                    <input type="search" placeholder="Search duas..." data-admin-search>
                </label>
                <button type="button" class="btn-primary" data-admin-create>
                    <i class="fa-solid fa-plus"></i>
                    <span>New Dua</span>
                </button>
            </div>
        </div>

        <div class="table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Category</th>
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

