<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dua;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DuaController extends Controller
{
    public function index(): View
    {
        $duas = Dua::query()
            ->latest('id')
            ->paginate(25);

        return view('admin.duas.index', compact('duas'));
    }

    public function create(): View
    {
        $dua = new Dua(['is_active' => true]);

        return view('admin.duas.create', compact('dua'));
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
        return view('admin.duas.edit', compact('dua'));
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
            'title' => ['required', 'string', 'max:255'],
            'text_ar' => ['nullable', 'string'],
            'text_bn' => ['nullable', 'string'],
            'transliteration' => ['nullable', 'string'],
            'reference' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data['is_active'] = $request->boolean('is_active', true);

        return $data;
    }
}
