<div class="row g-3">
    <div class="col-md-6">
        <label class="form-label">Categorie Name<span class="text-danger">*</span></label>
        <input type="text" name="name" class="form-control" value="{{ old('name', $category->name) }}" required>
    </div>
    <div class="col-md-6">
        <label class="form-label">Slug</label>
        <input type="text" name="slug" class="form-control" value="{{ old('slug', $category->slug) }}" placeholder="auto-generated if empty">
    </div>
    <div class="col-md-8">
        <label class="form-label">Description</label>
        <textarea name="description" class="form-control" rows="3" placeholder="Optional short description shown in internal lists">{{ old('description', $category->description) }}</textarea>
    </div>
    <div class="col-md-2">
        <label class="form-label">Display Order</label>
        <input type="number" name="sort_order" min="0" class="form-control" value="{{ old('sort_order', $category->sort_order) }}" placeholder="0">
    </div>
    <div class="col-md-2 d-flex align-items-end">
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" name="is_active" value="1" id="Categorie-active" {{ old('is_active', $category->is_active ?? true) ? 'checked' : '' }}>
            <label class="form-check-label" for="Categorie-active">Active</label>
        </div>
    </div>
</div>
