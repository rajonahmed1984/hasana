<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Surah;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SurahController extends Controller
{
    public function index()
    {
        $surahs = Surah::orderBy('number')->paginate(30);

        return view('admin.surahs.index', compact('surahs'));
    }

    public function create()
    {
        $surah = new Surah();

        return view('admin.surahs.create', compact('surah'));
    }

    public function store(Request $request)
    {
        $data = $this->validatedData($request);

        $surah = Surah::create($data);

        return redirect()
            ->route('admin.surahs.edit', $surah)
            ->with('status', 'Surah created successfully. You can now add ayahs.');
    }

    public function show(Surah $surah)
    {
        return redirect()->route('admin.surahs.edit', $surah);
    }

    public function edit(Surah $surah)
    {
        $surah->load('ayahs');

        return view('admin.surahs.edit', compact('surah'));
    }

    public function update(Request $request, Surah $surah)
    {
        $data = $this->validatedData($request, $surah->id, $surah->meta ?? []);
        $surah->update($data);

        return redirect()
            ->route('admin.surahs.edit', $surah)
            ->with('status', 'Surah updated successfully.');
    }

    public function destroy(Surah $surah)
    {
        $surah->delete();

        return redirect()
            ->route('admin.surahs.index')
            ->with('status', 'Surah removed.');
    }

    protected function validatedData(Request $request, ?int $ignoreId = null, array $currentMeta = []): array
    {
        $validated = $request->validate([
            'number' => ['required', 'integer', 'min:1', 'max:250', Rule::unique('surahs', 'number')->ignore($ignoreId)],
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('surahs', 'slug')->ignore($ignoreId)],
            'revelation_type' => ['nullable', 'string', 'max:50'],
            'summary' => ['nullable', 'string'],
            'name_bn' => ['nullable', 'string', 'max:255'],
            'meaning_bn' => ['nullable', 'string', 'max:255'],
            'summary_bn' => ['nullable', 'string'],
            'revelation_order' => ['nullable', 'integer', 'min:1', 'max:250'],
        ]);

        $validated['slug'] = $validated['slug'] ? Str::slug($validated['slug']) : Str::slug($validated['name_en']);

        $metaUpdates = [
            'name_bn' => $validated['name_bn'] ?? null,
            'meaning_bn' => $validated['meaning_bn'] ?? null,
            'summary_bn' => $validated['summary_bn'] ?? null,
            'revelation_order' => $validated['revelation_order'] ?? null,
        ];

        foreach (['name_bn', 'meaning_bn', 'summary_bn'] as $key) {
            $value = $metaUpdates[$key];
            if ($value !== null && $value !== '') {
                $currentMeta[$key] = $value;
            } else {
                unset($currentMeta[$key]);
            }
            unset($validated[$key]);
        }

        $order = $metaUpdates['revelation_order'];
        if ($order !== null && $order !== '') {
            $currentMeta['revelation_order'] = (int) $order;
        } else {
            unset($currentMeta['revelation_order']);
        }
        unset($validated['revelation_order']);

        $validated['meta'] = $currentMeta;

        return $validated;
    }
}
