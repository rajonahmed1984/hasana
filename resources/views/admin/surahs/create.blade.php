@extends('admin.layouts.app')

@section('content')
<div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">Create Surah</h1>
        <a href="{{ route('admin.surahs.index', [], false) }}" class="btn btn-outline-secondary">Back</a>
    </div>

    @if ($errors->any())
        <div class="alert alert-danger">
            <strong>Validation failed:</strong>
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="card">
        <div class="card-body">
            <form action="{{ route('admin.surahs.store', [], false) }}" method="POST">
                @csrf
                @php
                    $meta = $surah->meta ?? [];
                @endphp

                <div class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label">Surah Number</label>
                        <input type="number" min="1" class="form-control" name="number" value="{{ old('number', $surah->number) }}" required>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Slug</label>
                        <input type="text" class="form-control" name="slug" value="{{ old('slug', $surah->slug) }}" placeholder="auto-generated if empty">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Revelation Type</label>
                        <select name="revelation_type" class="form-select">
                            <option value="">Select type</option>
                            @foreach (['Meccan', 'Medinan'] as $type)
                                <option value="{{ strtolower($type) }}" @selected(old('revelation_type', $surah->revelation_type) === strtolower($type))>{{ $type }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Revelation Order</label>
                        <input type="number" min="1" class="form-control" name="meta[revelation_order]" value="{{ old('meta.revelation_order', data_get($meta, 'revelation_order', '')) }}" placeholder="e.g. 5">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Name (Arabic)</label>
                        <input type="text" class="form-control" name="name_ar" value="{{ old('name_ar', $surah->name_ar) }}" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Name (Bangla)</label>
                        <input type="text" class="form-control" name="meta[name_bn]" value="{{ old('meta.name_bn', data_get($meta, 'name_bn', '')) }}" placeholder="সূরা আল-ফাতিহা">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Meaning (Bangla)</label>
                        <input type="text" class="form-control" name="meta[meaning_bn]" value="{{ old('meta.meaning_bn', data_get($meta, 'meaning_bn', '')) }}" placeholder="উদাহরণ: সূচনা">
                    </div>
                    <div class="col-12">
                        <label class="form-label">Summary (Bangla)</label>
                        <textarea class="form-control" name="meta[summary_bn]" rows="4" placeholder="এই সূরাটি নবুয়তের প্রাথমিক যুগে অবতীর্ণ হয় এবং এটি ইসলামের মৌলিক ভিত্তি স্থাপন করে।">{{ old('meta.summary_bn', data_get($meta, 'summary_bn', '')) }}</textarea>
                    </div>
                </div>



                <div class="d-flex justify-content-end mt-4">
                    <button type="submit" class="btn btn-primary">Save Surah</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection 
