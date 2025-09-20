<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DuaCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class DuaCategoryController extends Controller
{
    public function index(): View
    {
        $categories = DuaCategory::query()
            ->withCount('duas')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(30);

        return view('admin.dua_categories.index', compact('categories'));
    }

    public function create(): View
    {
        $category = new DuaCategory(['is_active' => true, 'sort_order' => 0]);

        return view('admin.dua_categories.create', compact('category'));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);

        DuaCategory::create($data);

        return redirect()
            ->route('admin.dua-categories.index')
            ->with('status', 'Dua category created.');
    }

    public function edit(DuaCategory $duaCategory): View
    {
        return view('admin.dua_categories.edit', ['category' => $duaCategory]);
    }

    public function update(Request $request, DuaCategory $duaCategory): RedirectResponse
    {
        $data = $this->validatedData($request, $duaCategory->id);

        $duaCategory->update($data);

        return redirect()
            ->route('admin.dua-categories.index')
            ->with('status', 'Dua category updated.');
    }

    public function destroy(DuaCategory $duaCategory): RedirectResponse
    {
        $duaCategory->delete();

        return redirect()
            ->route('admin.dua-categories.index')
            ->with('status', 'Dua category removed.');
    }

    protected function validatedData(Request $request, ?int $ignoreId = null): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('dua_categories', 'slug')->ignore($ignoreId)],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $validated['slug'] = $validated['slug']
            ? Str::slug($validated['slug'])
            : Str::slug($validated['name']);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);
        $validated['is_active'] = $request->boolean('is_active', true);

        return $validated;
    }
}
