<div class="row g-3">
    <div class="col-md-6">
        <label class="form-label">Category</label>
        <select name="dua_category_id" class="form-select">
            <option value="">Select category</option>
            @foreach ($categories as $category)
                <option value="{{ $category->id }}" @selected(old('dua_category_id', $dua->dua_category_id) == $category->id)>{{ $category->name }}</option>
            @endforeach
        </select>
        <div class="form-text">Manage categories under Dua Categories.</div>
    </div>
    <div class="col-md-3">
        <label class="form-label">Display Order</label>
        <input type="number" name="sort_order" min="0" class="form-control" value="{{ old('sort_order', $dua->sort_order) }}" placeholder="0">
    </div>
    <div class="col-md-3 d-flex align-items-end">
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" name="is_active" value="1" id="dua-is-active" {{ old('is_active', $dua->is_active ?? true) ? 'checked' : '' }}>
            <label class="form-check-label" for="dua-is-active">Visible</label>
        </div>
    </div>
    <div class="col-md-12">
        <label class="form-label">Title<span class="text-danger">*</span></label>
        <input type="text" name="title" class="form-control" value="{{ old('title', $dua->title) }}" required>
    </div>
    <div class="col-md-12">
        <label class="form-label">Arabic Text</label>
        <textarea name="text_ar" class="form-control" rows="3">{{ old('text_ar', $dua->text_ar) }}</textarea>
    </div>
    <div class="col-md-12">
        <label class="form-label">Bangla Translation</label>
        <textarea name="text_bn" class="form-control" rows="4">{{ old('text_bn', $dua->text_bn) }}</textarea>
    </div>
    <div class="col-md-12">
        <label class="form-label">Pronunciation / Transliteration</label>
        <textarea name="transliteration" class="form-control" rows="3">{{ old('transliteration', $dua->transliteration) }}</textarea>
    </div>
    <div class="col-md-6">
        <label class="form-label">Reference</label>
        <input type="text" name="reference" class="form-control" value="{{ old('reference', $dua->reference) }}">
    </div>
</div>
