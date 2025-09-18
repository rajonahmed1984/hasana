<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ayah;
use App\Models\Surah;
use Illuminate\Http\Request;

class AyahController extends Controller
{
    public function index(Surah $surah)
    {
        $ayahs = $surah->ayahs()->paginate(50);

        return view('admin.ayahs.index', compact('surah', 'ayahs'));
    }

    public function create(Surah $surah)
    {
        $ayah = new Ayah(['is_active' => true]);

        return view('admin.ayahs.create', compact('surah', 'ayah'));
    }

    public function store(Request $request, Surah $surah)
    {
        $data = $request->validate([
            'number' => ['required', 'integer', 'min:1', 'unique:ayahs,number,NULL,id,surah_id,' . $surah->id],
            'text_ar' => ['required', 'string'],
            'text_en' => ['nullable', 'string'],
            'transliteration' => ['nullable', 'string'],
            'audio_url' => ['nullable', 'url'],
            'footnotes' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data['is_active'] = $request->boolean('is_active', true);
        $surah->ayahs()->create($data);
        $surah->update(['ayah_count' => $surah->ayahs()->count()]);

        return redirect()
            ->route('admin.surahs.ayahs.index', $surah)
            ->with('status', 'Ayah created successfully.');
    }

    public function edit(Surah $surah, Ayah $ayah)
    {
        $this->ensureBelongsToSurah($surah, $ayah);

        return view('admin.ayahs.edit', compact('surah', 'ayah'));
    }

    public function update(Request $request, Surah $surah, Ayah $ayah)
    {
        $this->ensureBelongsToSurah($surah, $ayah);

        $data = $request->validate([
            'number' => ['required', 'integer', 'min:1', 'unique:ayahs,number,' . $ayah->id . ',id,surah_id,' . $surah->id],
            'text_ar' => ['required', 'string'],
            'text_en' => ['nullable', 'string'],
            'transliteration' => ['nullable', 'string'],
            'audio_url' => ['nullable', 'url'],
            'footnotes' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data['is_active'] = $request->boolean('is_active', true);
        $ayah->update($data);
        $surah->update(['ayah_count' => $surah->ayahs()->count()]);

        return redirect()
            ->route('admin.surahs.ayahs.index', $surah)
            ->with('status', 'Ayah updated successfully.');
    }

    public function destroy(Surah $surah, Ayah $ayah)
    {
        $this->ensureBelongsToSurah($surah, $ayah);

        $ayah->delete();
        $surah->update(['ayah_count' => $surah->ayahs()->count()]);

        return redirect()
            ->route('admin.surahs.ayahs.index', $surah)
            ->with('status', 'Ayah removed.');
    }

    protected function ensureBelongsToSurah(Surah $surah, Ayah $ayah): void
    {
        abort_if($ayah->surah_id !== $surah->id, 404);
    }
}

