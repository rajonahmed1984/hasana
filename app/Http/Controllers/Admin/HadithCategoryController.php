<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HadithCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class HadithCategoryController extends Controller
{
    public function index(): View
    {
        $categories = HadithCategory::query()
            ->withCount('hadiths')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(30);

        return view('admin.hadith_categories.index', compact('categories'));
    }

    public function create(): View
    {
        $category = new HadithCategory(['is_active' => true, 'sort_order' => 0]);

        return view('admin.hadith_categories.create', compact('category'));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);

        HadithCategory::create($data);

        return redirect()
            ->route('admin.hadith-categories.index')
            ->with('status', 'Hadith collection created.');
    }

    public function edit(HadithCategory $hadithCategory): View
    {
        return view('admin.hadith_categories.edit', ['category' => $hadithCategory]);
    }

    public function update(Request $request, HadithCategory $hadithCategory): RedirectResponse
    {
        $data = $this->validatedData($request, $hadithCategory->id);

        $hadithCategory->update($data);

        return redirect()
            ->route('admin.hadith-categories.index')
            ->with('status', 'Hadith collection updated.');
    }

    public function destroy(HadithCategory $hadithCategory): RedirectResponse
    {
        $hadithCategory->delete();

        return redirect()
            ->route('admin.hadith-categories.index')
            ->with('status', 'Hadith collection removed.');
    }

    protected function validatedData(Request $request, ?int $ignoreId = null): array
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('hadith_categories', 'slug')->ignore($ignoreId)],
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
