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
        <input type="number" min="1" class="form-control" name="revelation_order" value="{{ old('revelation_order', $surah->meta['revelation_order'] ?? '') }}" placeholder="e.g. 5">
    </div>
    <div class="col-md-6">
        <label class="form-label">Name (Arabic)</label>
        <input type="text" class="form-control" name="name_ar" value="{{ old('name_ar', $surah->name_ar) }}" required>
    </div>
    <div class="col-md-6">
        <label class="form-label">Name (English)</label>
        <input type="text" class="form-control" name="name_en" value="{{ old('name_en', $surah->name_en) }}" required>
    </div>
    <div class="col-md-6">
        <label class="form-label">Name (Bangla)</label>
        <input type="text" class="form-control" name="name_bn" value="{{ old('name_bn', $surah->meta['name_bn'] ?? '') }}" placeholder="সূরা আল-ফাতিহা">
    </div>
    <div class="col-md-6">
        <label class="form-label">Meaning (Bangla)</label>
        <input type="text" class="form-control" name="meaning_bn" value="{{ old('meaning_bn', $surah->meta['meaning_bn'] ?? '') }}" placeholder="উদাহরণ: সূচনা">
    </div>
    <div class="col-12">
        <label class="form-label">Summary (English)</label>
        <textarea class="form-control" name="summary" rows="4" placeholder="Optional short description shown on surah pages">{{ old('summary', $surah->summary) }}</textarea>
    </div>
    <div class="col-12">
        <label class="form-label">Summary (Bangla)</label>
        <textarea class="form-control" name="summary_bn" rows="4" placeholder="এই সূরাটি নবুয়তের প্রাথমিক যুগে অবতীর্ণ হয় এবং এটি ইসলামের মৌলিক ভিত্তি স্থাপন করে।">{{ old('summary_bn', $surah->meta['summary_bn'] ?? '') }}</textarea>
    </div>
</div>

