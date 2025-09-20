<div class="row g-3">
    <div class="col-md-2">
        <label class="form-label">Ayah Number</label>
        <input type="number" class="form-control" min="1" name="number" value="{{ old('number', $ayah->number) }}">
    </div>
    <div class="col-md-4">
        <label class="form-label">Audio URL</label>
        <input type="url" name="audio_url" class="form-control" value="{{ old('audio_url', $ayah->audio_url) }}" placeholder="https://...">
    </div>
    <div class="col-md-4">
        <label class="form-label">Footnotes / Notes</label>
        <textarea name="footnotes" class="form-control" rows="1">{{ old('footnotes', $ayah->footnotes) }}</textarea>
    </div>
    <div class="col-md-2 form-check form-switch d-flex align-items-center">
        <input class="form-check-input" type="checkbox" role="switch" name="is_active" value="1" id="ayah-is-active" {{ old('is_active', $ayah->is_active ?? true) ? 'checked' : '' }}>
        <label class="form-check-label" for="ayah-is-active">Visible</label>
    </div>
    <div class="col-md-12">
        <label class="form-label">Bangla Translation</label>
        <textarea name="text_bn" class="form-control" rows="3">{{ old('text_bn', $ayah->text_bn) }}</textarea>
    </div>
    <div class="col-md-12">
        <label class="form-label">Bangla Pronunciation</label>
        <textarea name="transliteration" class="form-control" rows="2">{{ old('transliteration', $ayah->transliteration) }}</textarea>
    </div>
    <div class="col-md-12">
        <label class="form-label">Arabic Text</label>
        <textarea name="text_ar" class="form-control" rows="3">{{ old('text_ar', $ayah->text_ar) }}</textarea>
    </div>
    
</div>


