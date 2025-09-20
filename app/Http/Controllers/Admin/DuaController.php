<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesAjaxResponses;
use App\Http\Controllers\Controller;
use App\Models\Dua;
use App\Models\DuaCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DuaController extends Controller
{
    use HandlesAjaxResponses;

    public function index(Request $request): View|JsonResponse
    {
        $query = Dua::query()->with('category');

        $search = trim((string) $request->query('search', ''));
        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('title', 'like', '%' . $search . '%')
                    ->orWhere('text_bn', 'like', '%' . $search . '%')
                    ->orWhere('text_ar', 'like', '%' . $search . '%')
                    ->orWhere('reference', 'like', '%' . $search . '%');
            });
        }

        $categoryId = $request->query('category');
        if ($categoryId) {
            $query->where('dua_category_id', $categoryId);
        }

        $activeFilter = $this->parseBooleanFilter($request->query('is_active'));
        if ($activeFilter !== null) {
            $query->where('is_active', $activeFilter);
        }

        $sort = $request->query('sort', 'sort_order');
        $allowedSort = ['sort_order', 'id', 'title', 'created_at'];
        if (!in_array($sort, $allowedSort, true)) {
            $sort = 'sort_order';
        }

        $direction = strtolower((string) $request->query('direction', 'asc'));
        if (!in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'asc';
        }

        $query->orderBy($sort, $direction)->orderBy('id');

        $perPage = (int) $request->query('per_page', 25);
        $perPage = max(5, min(100, $perPage));

        $duas = $query->paginate($perPage)->withQueryString();
        $categories = $this->categoryOptions();

        if ($request->expectsJson()) {
            return $this->paginatedResponse(
                $duas,
                fn (Dua $dua) => $this->transformDua($dua),
                [
                    'filters' => [
                        'options' => [
                            'categories' => $this->categoriesToArray($categories),
                        ],
                        'active' => [
                            'search' => $search ?: null,
                            'category' => $categoryId ? (int) $categoryId : null,
                            'is_active' => $activeFilter,
                        ],
                    ],
                ]
            );
        }

        return view('admin.duas.index', compact('duas', 'categories'));
    }

    public function create(Request $request): View|JsonResponse
    {
        $dua = new Dua(['is_active' => true, 'sort_order' => 0]);
        $categories = $this->categoryOptions();

        if ($request->expectsJson()) {
            return response()->json([
                'data' => $this->transformDua($dua),
                'meta' => [
                    'categories' => $this->categoriesToArray($categories),
                ],
            ]);
        }

        return view('admin.duas.create', compact('dua', 'categories'));
    }

    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $data = $this->validatePayload($request);

        $dua = Dua::create($data)->load('category');

        if ($request->expectsJson()) {
            return $this->messageResponse(
                'Dua entry created.',
                $this->transformDua($dua),
                201
            );
        }

        return redirect()
            ->route('admin.duas.index')
            ->with('status', 'Dua entry created.');
    }

    public function edit(Request $request, Dua $dua): View|JsonResponse
    {
        $dua->load('category');
        $categories = $this->categoryOptions();

        if ($request->expectsJson()) {
            return response()->json([
                'data' => $this->transformDua($dua),
                'meta' => [
                    'categories' => $this->categoriesToArray($categories),
                ],
            ]);
        }

        return view('admin.duas.edit', compact('dua', 'categories'));
    }

    public function update(Request $request, Dua $dua): RedirectResponse|JsonResponse
    {
        $data = $this->validatePayload($request);

        $dua->update($data);
        $dua->load('category');

        if ($request->expectsJson()) {
            return $this->messageResponse(
                'Dua entry updated.',
                $this->transformDua($dua)
            );
        }

        return redirect()
            ->route('admin.duas.index')
            ->with('status', 'Dua entry updated.');
    }

    public function destroy(Request $request, Dua $dua): RedirectResponse|JsonResponse
    {
        $dua->delete();

        if ($request->expectsJson()) {
            return $this->messageResponse('Dua entry removed.');
        }

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

    protected function categoriesToArray($categories): array
    {
        return $categories
            ->map(fn (DuaCategory $category) => [
                'id' => $category->id,
                'name' => $category->name,
            ])
            ->values()
            ->all();
    }

    protected function transformDua(Dua $dua): array
    {
        $dua->loadMissing('category');

        return [
            'id' => $dua->id,
            'dua_category_id' => $dua->dua_category_id,
            'title' => $dua->title,
            'text_ar' => $dua->text_ar,
            'text_bn' => $dua->text_bn,
            'transliteration' => $dua->transliteration,
            'reference' => $dua->reference,
            'sort_order' => (int) $dua->sort_order,
            'is_active' => (bool) $dua->is_active,
            'category' => $dua->category ? [
                'id' => $dua->category->id,
                'name' => $dua->category->name,
            ] : null,
            'created_at' => optional($dua->created_at)->toIso8601String(),
            'updated_at' => optional($dua->updated_at)->toIso8601String(),
        ];
    }
}
