<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hadith;
use App\Models\HadithCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class HadithController extends Controller
{
    public function index(): View
    {
        $hadiths = Hadith::query()
            ->with('category')
            ->latest('id')
            ->paginate(25);

        return view('admin.hadiths.index', compact('hadiths'));
    }

    public function create(): View
    {
        $hadith = new Hadith(['is_active' => true, 'sort_order' => 0]);
        $categories = $this->categoryOptions();

        return view('admin.hadiths.create', compact('hadith', 'categories'));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePayload($request);

        Hadith::create($data);

        return redirect()
            ->route('admin.hadiths.index')
            ->with('status', 'Hadith entry created.');
    }

    public function edit(Hadith $hadith): View
    {
        $categories = $this->categoryOptions();

        return view('admin.hadiths.edit', compact('hadith', 'categories'));
    }

    public function update(Request $request, Hadith $hadith): RedirectResponse
    {
        $data = $this->validatePayload($request);

        $hadith->update($data);

        return redirect()
            ->route('admin.hadiths.index')
            ->with('status', 'Hadith entry updated.');
    }

    public function destroy(Hadith $hadith): RedirectResponse
    {
        $hadith->delete();

        return redirect()
            ->route('admin.hadiths.index')
            ->with('status', 'Hadith entry removed.');
    }

    protected function validatePayload(Request $request): array
    {
        $data = $request->validate([
            'hadith_category_id' => ['nullable', 'exists:hadith_categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'text_ar' => ['nullable', 'string'],
            'text_bn' => ['nullable', 'string'],
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
        return HadithCategory::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name']);
    }
}

