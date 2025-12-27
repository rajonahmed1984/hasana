@extends('admin.layouts.app')

@section('page_title', 'Users')
@section('page_subtitle', 'Manage admin users and their access.')

@section('content')
<div
    class="admin-card"
    data-admin-table="users"
    data-endpoint="{{ route('admin.users.index', [], false) }}"
    data-store-endpoint="{{ route('admin.users.store', [], false) }}"
    data-update-template="{{ route('admin.users.update', ['user' => '__ID__'], false) }}"
    data-delete-template="{{ route('admin.users.destroy', ['user' => '__ID__'], false) }}"
>
    <div class="admin-table-shell">
        <div class="table-controls">
            <div class="controls-left">
                <h2 class="controls-title">User Management</h2>
                <p class="controls-description">Add, edit, or remove admin users. Each user can manage all content in the system.</p>
            </div>
            <div class="controls-right">
                <label class="search-field">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="search" placeholder="Search users..." data-admin-search>
                </label>
                <button type="button" class="btn-primary" data-admin-create>
                    <i class="fa-solid fa-plus"></i>
                    <span>New User</span>
                </button>
            </div>
        </div>
        
        <div class="table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody data-admin-tbody>
                    <tr class="table-empty">
                        <td colspan="5">Loading records...</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="table-footer" data-admin-pagination-container></div>
    </div>
</div>
@endsection

