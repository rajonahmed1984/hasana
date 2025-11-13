<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesAjaxResponses;
use App\Http\Controllers\Controller;
use App\Models\Surah;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class SurahController extends Controller
{
    use HandlesAjaxResponses;

    public function index(Request $request): View|JsonResponse
    {
        $query = Surah::query();

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('name_en', 'like', '%' . $search . '%')
                    ->orWhere('name_ar', 'like', '%' . $search . '%')
                    ->orWhere('slug', 'like', '%' . $search . '%')
                    ->orWhere('meta->name_bn', 'like', '%' . $search . '%');

                if (ctype_digit($search)) {
                    $builder->orWhere('number', (int) $search);
                }
            });
        }

        if ($revelation = $request->query('revelation_type')) {
            $query->where('revelation_type', $revelation);
        }

        $direction = strtolower((string) $request->query('direction', 'asc'));
        if (!in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'asc';
        }

        $sort = $request->query('sort', 'number');
        if (!in_array($sort, ['number', 'name_en', 'ayah_count'], true)) {
            $sort = 'number';
        }

        $query->orderBy($sort, $direction)->orderBy('id');

        $perPage = (int) $request->query('per_page', 30);
        $perPage = max(5, min(100, $perPage));

        $surahs = $query->paginate($perPage)->withQueryString();

        if ($request->expectsJson()) {
            return $this->paginatedResponse($surahs, fn (Surah $surah) => $this->transformSurah($surah));
        }

        return view('admin.surahs.index', compact('surahs'));
    }

    public function create(Request $request): View|JsonResponse
    {
        $surah = new Surah();

        if ($request->expectsJson()) {
            return response()->json(['data' => $this->transformSurah($surah)]);
        }

        return view('admin.surahs.create', compact('surah'));
    }

    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $data = $this->validatedData($request);

        $surah = Surah::create($data);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Surah created successfully. You can now add ayahs.',
                'data' => $this->transformSurah($surah->refresh()),
            ], 201);
        }

        return redirect()
            ->route('admin.surahs.edit', $surah)
            ->with('status', 'Surah created successfully. You can now add ayahs.');
    }

    public function show(Request $request, Surah $surah): RedirectResponse|JsonResponse
    {
        if ($request->expectsJson()) {
            return response()->json(['data' => $this->transformSurah($surah)]);
        }

        return redirect()->route('admin.surahs.edit', $surah);
    }

    public function edit(Request $request, Surah $surah): View|JsonResponse
    {
        if ($request->expectsJson()) {
            return response()->json(['data' => $this->transformSurah($surah)]);
        }

        $surah->load('ayahs');

        return view('admin.surahs.edit', compact('surah'));
    }

    public function update(Request $request, Surah $surah): RedirectResponse|JsonResponse
    {
        $data = $this->validatedData($request, $surah->id, $surah->meta ?? []);
        $surah->update($data);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Surah updated successfully.',
                'data' => $this->transformSurah($surah->refresh()),
            ]);
        }

        return redirect()
            ->route('admin.surahs.edit', $surah)
            ->with('status', 'Surah updated successfully.');
    }

    public function destroy(Request $request, Surah $surah): RedirectResponse|JsonResponse
    {
        $surah->delete();

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Surah removed.']);
        }

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
            'meta.name_bn' => ['nullable', 'string', 'max:255'],
            'meta.meaning_bn' => ['nullable', 'string', 'max:255'],
            'meta.summary_bn' => ['nullable', 'string'],
            'meta.revelation_order' => ['nullable', 'integer', 'min:1', 'max:250'],
        ]);

        $validated['slug'] = $validated['slug'] ? Str::slug($validated['slug']) : Str::slug($validated['name_en']);

        $metaInput = $validated['meta'] ?? [];
        unset($validated['meta']);

        $metaUpdates = [
            'name_bn' => data_get($metaInput, 'name_bn'),
            'meaning_bn' => data_get($metaInput, 'meaning_bn'),
            'summary_bn' => data_get($metaInput, 'summary_bn'),
            'revelation_order' => data_get($metaInput, 'revelation_order'),
        ];

        foreach (['name_bn', 'meaning_bn', 'summary_bn'] as $key) {
            $value = $metaUpdates[$key];
            if ($value !== null && $value !== '') {
                $currentMeta[$key] = $value;
            } else {
                unset($currentMeta[$key]);
            }
        }

        $order = $metaUpdates['revelation_order'];
        if ($order !== null && $order !== '') {
            $currentMeta['revelation_order'] = (int) $order;
        } else {
            unset($currentMeta['revelation_order']);
        }

        $validated['meta'] = $currentMeta;

        return $validated;
    }

    protected function transformSurah(Surah $surah): array
    {
        $meta = $surah->meta ?? [];

        return [
            'id' => $surah->id,
            'number' => $surah->number,
            'name_ar' => $surah->name_ar,
            'name_en' => $surah->name_en,
            'slug' => $surah->slug,
            'revelation_type' => $surah->revelation_type,
            'summary' => $surah->summary,
            'ayah_count' => $surah->ayah_count ?? 0,
            'meta' => [
                'name_bn' => data_get($meta, 'name_bn'),
                'meaning_bn' => data_get($meta, 'meaning_bn'),
                'summary_bn' => data_get($meta, 'summary_bn'),
                'revelation_order' => data_get($meta, 'revelation_order'),
            ],
            'created_at' => optional($surah->created_at)->toIso8601String(),
            'updated_at' => optional($surah->updated_at)->toIso8601String(),
        ];
    }
}
