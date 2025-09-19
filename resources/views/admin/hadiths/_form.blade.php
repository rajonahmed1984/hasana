<div class="row g-3">
    <div class="col-md-8">
        <label class="form-label">Title<span class="text-danger">*</span></label>
        <input type="text" name="title" class="form-control" value="{{ old('title', $hadith->title) }}" required>
    </div>
    <div class="col-md-4 d-flex align-items-end">
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" name="is_active" value="1" id="hadith-is-active" {{ old('is_active', $hadith->is_active ?? true) ? 'checked' : '' }}>
            <label class="form-check-label" for="hadith-is-active">Visible</label>
        </div>
    </div>
    <div class="col-md-12">
        <label class="form-label">Arabic Text</label>
        <textarea name="text_ar" class="form-control" rows="3">{{ old('text_ar', $hadith->text_ar) }}</textarea>
    </div>
    <div class="col-md-12">
        <label class="form-label">Bangla Translation</label>
        <textarea name="text_bn" class="form-control" rows="4">{{ old('text_bn', $hadith->text_bn) }}</textarea>
    </div>
    <div class="col-md-6">
        <label class="form-label">Reference</label>
        <input type="text" name="reference" class="form-control" value="{{ old('reference', $hadith->reference) }}">
    </div>
</div>
