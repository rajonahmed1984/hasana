@extends('admin.layouts.app')

@section('page_title', 'Surahs')
@section('page_subtitle', 'Browse, paginate, and edit surahs instantly with inline tools.')

@section('content')
<div
    class="admin-card"
    data-admin-table="surahs"
    data-endpoint="{{ route('admin.surahs.index') }}"
    data-create-endpoint="{{ route('admin.surahs.create') }}"
    data-store-endpoint="{{ route('admin.surahs.store') }}"
    data-edit-template="{{ url('admin/surahs/__ID__/edit') }}"
    data-update-template="{{ url('admin/surahs/__ID__') }}"
    data-delete-template="{{ url('admin/surahs/__ID__') }}"
    data-extra='@json(["links" => ["ayahs" => url("admin/surahs/__ID__/ayahs")]])'
>
    <div class="admin-table-shell">
        <div class="table-controls">
            <div class="controls-left">
                <h2 class="controls-title">Surah Library</h2>
                <p class="controls-description">Use the search box to filter by English, Arabic, or Bangla names. Open each surah to curate ayahs without leaving the page.</p>
            </div>
            <div class="controls-right">
                <label class="search-field">
                    <i class="bi bi-search"></i>
                    <input type="search" placeholder="Search surahs..." data-admin-search>
                </label>
                <button type="button" class="btn-primary" data-admin-create>
                    <i class="bi bi-plus-lg"></i>
                    <span>New Surah</span>
                </button>
            </div>
        </div>

        <div class="table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Arabic</th>
                        <th>English</th>
                        <th>Bangla</th>
                        <th>Ayahs</th>
                        <th>Revelation</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody data-admin-tbody>
                    <tr class="table-empty">
                        <td colspan="7">Loading records...</td>
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
