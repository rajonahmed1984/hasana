@extends('admin.layouts.app')

@section('page_title', 'Ayahs - ' . $surah->name_en)
@section('page_subtitle', 'Review and update ayahs without breaking your editing flow.')

@section('content')
<div
    class="admin-card"
    data-admin-table="ayahs"
    data-endpoint="{{ route('admin.surahs.ayahs.index', $surah, false) }}"
    data-create-endpoint="{{ route('admin.surahs.ayahs.create', $surah, false) }}"
    data-store-endpoint="{{ route('admin.surahs.ayahs.store', $surah, false) }}"
    data-edit-template="{{ route('admin.surahs.ayahs.edit', ['surah' => $surah, 'ayah' => '__ID__'], false) }}"
    data-update-template="{{ route('admin.surahs.ayahs.update', ['surah' => $surah, 'ayah' => '__ID__'], false) }}"
    data-delete-template="{{ route('admin.surahs.ayahs.destroy', ['surah' => $surah, 'ayah' => '__ID__'], false) }}"
    data-extra='@json(["surah" => ["id" => $surah->id, "number" => $surah->number, "name_en" => $surah->name_en]])'
>
    <div class="admin-table-shell">
        <div class="table-controls">
            <div class="controls-left">
                <h2 class="controls-title">Ayahs for {{ $surah->name_en }}</h2>
                <p class="controls-description">Search by translation or ayah number, toggle visibility, and update transliterations inline.</p>
            </div>
            <div class="controls-right">
                <label class="search-field">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="search" placeholder="Search ayahs..." data-admin-search>
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
                    <i class="fa-solid fa-plus"></i>
                    <span>New Ayah</span>
                </button>
                <a href="{{ route('admin.surahs.edit', $surah) }}" class="btn-secondary">
                    <i class="bi bi-arrow-left"></i>
                    <span>Back to Surah</span>
                </a>
            </div>
        </div>

        <div class="table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Bangla</th>
                        <th>Transliteration</th>
                        <th>Arabic</th>
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

