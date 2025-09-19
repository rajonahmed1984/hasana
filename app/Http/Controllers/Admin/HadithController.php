<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hadith;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class HadithController extends Controller
{
    public function index(): View
    {
        $hadiths = Hadith::query()
            ->latest('id')
            ->paginate(25);

        return view('admin.hadiths.index', compact('hadiths'));
    }

    public function create(): View
    {
        $hadith = new Hadith(['is_active' => true]);

        return view('admin.hadiths.create', compact('hadith'));
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
        return view('admin.hadiths.edit', compact('hadith'));
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
            'title' => ['required', 'string', 'max:255'],
            'text_ar' => ['nullable', 'string'],
            'text_bn' => ['nullable', 'string'],
            'reference' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data['is_active'] = $request->boolean('is_active', true);

        return $data;
    }
}
