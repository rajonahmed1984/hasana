<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesAjaxResponses;
use App\Http\Controllers\Controller;
use App\Models\HadithCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class HadithCategoryController extends Controller
{
    use HandlesAjaxResponses;

    public function index(Request $request): View|JsonResponse
    {
        $query = HadithCategory::query()->withCount('hadiths');

        $search = trim((string) $request->query('search', ''));
        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('name', 'like', '%' . $search . '%')
                    ->orWhere('slug', 'like', '%' . $search . '%');
            });
        }

        $activeFilter = $this->parseBooleanFilter($request->query('is_active'));
        if ($activeFilter !== null) {
            $query->where('is_active', $activeFilter);
        }

        $sort = $request->query('sort', 'sort_order');
        $allowedSort = ['sort_order', 'name', 'hadiths_count', 'created_at'];
        if (!in_array($sort, $allowedSort, true)) {
            $sort = 'sort_order';
        }

        $direction = strtolower((string) $request->query('direction', 'asc'));
        if (!in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'asc';
        }

        $query->orderBy($sort, $direction)->orderBy('id');

        $perPage = (int) $request->query('per_page', 30);
        $perPage = max(5, min(100, $perPage));

        $categories = $query->paginate($perPage)->withQueryString();

        if ($request->expectsJson()) {
            return $this->paginatedResponse(
                $categories,
                fn (HadithCategory $category) => $this->transformCategory($category),
                [
                    'filters' => [
                        'active' => [
                            'search' => $search ?: null,
                            'is_active' => $activeFilter,
                        ],
                    ],
                ]
            );
        }

        return view('admin.hadith_categories.index', compact('categories'));
    }

    public function create(Request $request): View|JsonResponse
    {
        $category = new HadithCategory(['is_active' => true, 'sort_order' => 0]);

        if ($request->expectsJson()) {
            return response()->json(['data' => $this->transformCategory($category)]);
        }

        return view('admin.hadith_categories.create', compact('category'));
    }

    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $data = $this->validatedData($request);

        $category = HadithCategory::create($data);

        if ($request->expectsJson()) {
            return $this->messageResponse(
                'Hadith collection created.',
                $this->transformCategory($category),
                201
            );
        }

        return redirect()
            ->route('admin.hadith-categories.index')
            ->with('status', 'Hadith collection created.');
    }

    public function edit(Request $request, HadithCategory $hadithCategory): View|JsonResponse
    {
        if ($request->expectsJson()) {
            return response()->json(['data' => $this->transformCategory($hadithCategory)]);
        }

        return view('admin.hadith_categories.edit', ['category' => $hadithCategory]);
    }

    public function update(Request $request, HadithCategory $hadithCategory): RedirectResponse|JsonResponse
    {
        $data = $this->validatedData($request, $hadithCategory->id);

        $hadithCategory->update($data);

        if ($request->expectsJson()) {
            return $this->messageResponse(
                'Hadith collection updated.',
                $this->transformCategory($hadithCategory)
            );
        }

        return redirect()
            ->route('admin.hadith-categories.index')
            ->with('status', 'Hadith collection updated.');
    }

    public function destroy(Request $request, HadithCategory $hadithCategory): RedirectResponse|JsonResponse
    {
        $hadithCategory->delete();

        if ($request->expectsJson()) {
            return $this->messageResponse('Hadith collection removed.');
        }

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

    protected function transformCategory(HadithCategory $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'description' => $category->description,
            'sort_order' => (int) $category->sort_order,
            'is_active' => (bool) $category->is_active,
            'hadiths_count' => $category->hadiths_count ?? $category->hadiths()->count(),
            'created_at' => optional($category->created_at)->toIso8601String(),
            'updated_at' => optional($category->updated_at)->toIso8601String(),
        ];
    }
}