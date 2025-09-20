<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesAjaxResponses;
use App\Http\Controllers\Controller;
use App\Models\Ayah;
use App\Models\Surah;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AyahController extends Controller
{
    use HandlesAjaxResponses;

    public function index(Request $request, Surah $surah): View|JsonResponse
    {
        $query = $surah->ayahs();

        $search = trim((string) $request->query('search', ''));
        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('number', $search)
                    ->orWhere('text_bn', 'like', '%' . $search . '%')
                    ->orWhere('text_ar', 'like', '%' . $search . '%')
                    ->orWhere('transliteration', 'like', '%' . $search . '%');
            });
        }

        $activeFilter = $this->parseBooleanFilter($request->query('is_active'));
        if ($activeFilter !== null) {
            $query->where('is_active', $activeFilter);
        }

        $sort = $request->query('sort', 'number');
        $allowedSort = ['number', 'created_at'];
        if (!in_array($sort, $allowedSort, true)) {
            $sort = 'number';
        }

        $direction = strtolower((string) $request->query('direction', 'asc'));
        if (!in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'asc';
        }

        $query->orderBy($sort, $direction)->orderBy('id');

        $perPage = (int) $request->query('per_page', 50);
        $perPage = max(5, min(200, $perPage));

        $ayahs = $query->paginate($perPage)->withQueryString();

        if ($request->expectsJson()) {
            return $this->paginatedResponse(
                $ayahs,
                fn (Ayah $ayah) => $this->transformAyah($ayah),
                [
                    'meta' => [
                        'surah' => $this->surahContext($surah),
                        'active_filters' => [
                            'search' => $search ?: null,
                            'is_active' => $activeFilter,
                        ],
                    ],
                ]
            );
        }

        return view('admin.ayahs.index', compact('surah', 'ayahs'));
    }

    public function create(Request $request, Surah $surah): View|JsonResponse
    {
        $ayah = new Ayah(['is_active' => true]);

        if ($request->expectsJson()) {
            return response()->json([
                'data' => $this->transformAyah($ayah),
                'meta' => [
                    'surah' => $this->surahContext($surah),
                ],
            ]);
        }

        return view('admin.ayahs.create', compact('surah', 'ayah'));
    }

    public function store(Request $request, Surah $surah): RedirectResponse|JsonResponse
    {
        $data = $this->validatedData($request, $surah);

        $ayah = $surah->ayahs()->create($data);
        $surah->update(['ayah_count' => $surah->ayahs()->count()]);

        if ($request->expectsJson()) {
            return $this->messageResponse(
                'Ayah created successfully.',
                $this->transformAyah($ayah),
                201
            );
        }

        return redirect()
            ->route('admin.surahs.ayahs.index', $surah)
            ->with('status', 'Ayah created successfully.');
    }

    public function edit(Request $request, Surah $surah, Ayah $ayah): View|JsonResponse
    {
        $this->ensureBelongsToSurah($surah, $ayah);

        if ($request->expectsJson()) {
            return response()->json([
                'data' => $this->transformAyah($ayah),
                'meta' => [
                    'surah' => $this->surahContext($surah),
                ],
            ]);
        }

        return view('admin.ayahs.edit', compact('surah', 'ayah'));
    }

    public function update(Request $request, Surah $surah, Ayah $ayah): RedirectResponse|JsonResponse
    {
        $this->ensureBelongsToSurah($surah, $ayah);

        $data = $this->validatedData($request, $surah, $ayah);

        $ayah->update($data);
        $surah->update(['ayah_count' => $surah->ayahs()->count()]);

        if ($request->expectsJson()) {
            return $this->messageResponse(
                'Ayah updated successfully.',
                $this->transformAyah($ayah)
            );
        }

        return redirect()
            ->route('admin.surahs.ayahs.index', $surah)
            ->with('status', 'Ayah updated successfully.');
    }

    public function destroy(Request $request, Surah $surah, Ayah $ayah): RedirectResponse|JsonResponse
    {
        $this->ensureBelongsToSurah($surah, $ayah);

        $ayah->delete();
        $surah->update(['ayah_count' => $surah->ayahs()->count()]);

        if ($request->expectsJson()) {
            return $this->messageResponse('Ayah removed.');
        }

        return redirect()
            ->route('admin.surahs.ayahs.index', $surah)
            ->with('status', 'Ayah removed.');
    }

    protected function validatedData(Request $request, Surah $surah, ?Ayah $ayah = null): array
    {
        $uniqueRule = 'unique:ayahs,number';
        if ($ayah) {
            $uniqueRule .= ',' . $ayah->id . ',id,surah_id,' . $surah->id;
        } else {
            $uniqueRule .= ',NULL,id,surah_id,' . $surah->id;
        }

        $data = $request->validate([
            'number' => ['nullable', 'integer', 'min:1', $uniqueRule],
            'text_ar' => ['nullable', 'string'],
            'text_bn' => ['nullable', 'string'],
            'transliteration' => ['nullable', 'string'],
            'audio_url' => ['nullable', 'url'],
            'footnotes' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if (!isset($data['number']) || $data['number'] === null || $data['number'] === '') {
            if ($ayah) {
                $data['number'] = $ayah->number;
            } else {
                $nextNumber = (int) $surah->ayahs()->max('number');
                $data['number'] = $nextNumber ? $nextNumber + 1 : 1;
            }
        }

        $data['text_ar'] = $data['text_ar'] ?? '';
        $data['is_active'] = $request->boolean('is_active', true);

        return $data;
    }

    protected function ensureBelongsToSurah(Surah $surah, Ayah $ayah): void
    {
        abort_if($ayah->surah_id !== $surah->id, 404);
    }

    protected function transformAyah(Ayah $ayah): array
    {
        return [
            'id' => $ayah->id,
            'surah_id' => $ayah->surah_id,
            'number' => $ayah->number,
            'text_ar' => $ayah->text_ar,
            'text_bn' => $ayah->text_bn,
            'transliteration' => $ayah->transliteration,
            'audio_url' => $ayah->audio_url,
            'footnotes' => $ayah->footnotes,
            'is_active' => (bool) $ayah->is_active,
            'created_at' => optional($ayah->created_at)->toIso8601String(),
            'updated_at' => optional($ayah->updated_at)->toIso8601String(),
        ];
    }

    protected function surahContext(Surah $surah): array
    {
        return [
            'id' => $surah->id,
            'number' => $surah->number,
            'name_en' => $surah->name_en,
            'name_ar' => $surah->name_ar,
        ];
    }
}