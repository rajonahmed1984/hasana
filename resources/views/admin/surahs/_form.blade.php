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
        <label class="form-label">Ayah Count</label>
        <input type="number" class="form-control" value="{{ $surah->ayah_count }}" disabled>
    </div>
    <div class="col-md-6">
        <label class="form-label">Name (Arabic)</label>
        <input type="text" class="form-control" name="name_ar" value="{{ old('name_ar', $surah->name_ar) }}" required>
    </div>
    <div class="col-md-6">
        <label class="form-label">Name (English)</label>
        <input type="text" class="form-control" name="name_en" value="{{ old('name_en', $surah->name_en) }}" required>
    </div>
    <div class="col-12">
        <label class="form-label">Summary / Description</label>
        <textarea name="summary" class="form-control" rows="4">{{ old('summary', $surah->summary) }}</textarea>
    </div>
</div>
