<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dua;
use App\Models\DuaCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DuaController extends Controller
{
    public function index(): View
    {
        $duas = Dua::query()
            ->with('category')
            ->latest('id')
            ->paginate(25);

        return view('admin.duas.index', compact('duas'));
    }

    public function create(): View
    {
        $dua = new Dua(['is_active' => true, 'sort_order' => 0]);
        $categories = $this->categoryOptions();

        return view('admin.duas.create', compact('dua', 'categories'));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePayload($request);

        Dua::create($data);

        return redirect()
            ->route('admin.duas.index')
            ->with('status', 'Dua entry created.');
    }

    public function edit(Dua $dua): View
    {
        $categories = $this->categoryOptions();

        return view('admin.duas.edit', compact('dua', 'categories'));
    }

    public function update(Request $request, Dua $dua): RedirectResponse
    {
        $data = $this->validatePayload($request);

        $dua->update($data);

        return redirect()
            ->route('admin.duas.index')
            ->with('status', 'Dua entry updated.');
    }

    public function destroy(Dua $dua): RedirectResponse
    {
        $dua->delete();

        return redirect()
            ->route('admin.duas.index')
            ->with('status', 'Dua entry removed.');
    }

    protected function validatePayload(Request $request): array
    {
        $data = $request->validate([
            'dua_category_id' => ['nullable', 'exists:dua_categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'text_ar' => ['nullable', 'string'],
            'text_bn' => ['nullable', 'string'],
            'transliteration' => ['nullable', 'string'],
            'reference' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);
        $data['is_active'] = $request->boolean('is_active', true);

        return $data;
    }

    protected function categoryOptions()
    {
        return DuaCategory::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name']);
    }
}

