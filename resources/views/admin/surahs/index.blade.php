@extends('admin.layouts.app')

@section('page_title', 'Surahs')
@section('page_subtitle', 'Browse, paginate, and edit surahs instantly with inline tools.')

@section('content')
<div
    class="admin-card"
    data-admin-table="surahs"
    data-endpoint="{{ route('admin.surahs.index', [], false) }}"
    data-create-endpoint="{{ route('admin.surahs.create', [], false) }}"
    data-store-endpoint="{{ route('admin.surahs.store', [], false) }}"
    data-edit-template="{{ route('admin.surahs.edit', ['surah' => '__ID__'], false) }}"
    data-update-template="{{ route('admin.surahs.update', ['surah' => '__ID__'], false) }}"
    data-delete-template="{{ route('admin.surahs.destroy', ['surah' => '__ID__'], false) }}"
    data-extra='@json(["links" => ["ayahs" => route('admin.surahs.ayahs.index', ['surah' => '__ID__'], false)]])'
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




