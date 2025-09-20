<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesAjaxResponses;
use App\Http\Controllers\Controller;
use App\Models\Hadith;
use App\Models\HadithCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class HadithController extends Controller
{
    use HandlesAjaxResponses;

    public function index(Request $request): View|JsonResponse
    {
        $query = Hadith::query()->with('category');

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
            $query->where('hadith_category_id', $categoryId);
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

        $hadiths = $query->paginate($perPage)->withQueryString();
        $categories = $this->categoryOptions();

        if ($request->expectsJson()) {
            return $this->paginatedResponse(
                $hadiths,
                fn (Hadith $hadith) => $this->transformHadith($hadith),
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

        return view('admin.hadiths.index', compact('hadiths', 'categories'));
    }

    public function create(Request $request): View|JsonResponse
    {
        $hadith = new Hadith(['is_active' => true, 'sort_order' => 0]);
        $categories = $this->categoryOptions();

        if ($request->expectsJson()) {
            return response()->json([
                'data' => $this->transformHadith($hadith),
                'meta' => [
                    'categories' => $this->categoriesToArray($categories),
                ],
            ]);
        }

        return view('admin.hadiths.create', compact('hadith', 'categories'));
    }

    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $data = $this->validatePayload($request);

        $hadith = Hadith::create($data)->load('category');

        if ($request->expectsJson()) {
            return $this->messageResponse(
                'Hadith entry created.',
                $this->transformHadith($hadith),
                201
            );
        }

        return redirect()
            ->route('admin.hadiths.index')
            ->with('status', 'Hadith entry created.');
    }

    public function edit(Request $request, Hadith $hadith): View|JsonResponse
    {
        $hadith->load('category');
        $categories = $this->categoryOptions();

        if ($request->expectsJson()) {
            return response()->json([
                'data' => $this->transformHadith($hadith),
                'meta' => [
                    'categories' => $this->categoriesToArray($categories),
                ],
            ]);
        }

        return view('admin.hadiths.edit', compact('hadith', 'categories'));
    }

    public function update(Request $request, Hadith $hadith): RedirectResponse|JsonResponse
    {
        $data = $this->validatePayload($request);

        $hadith->update($data);
        $hadith->load('category');

        if ($request->expectsJson()) {
            return $this->messageResponse(
                'Hadith entry updated.',
                $this->transformHadith($hadith)
            );
        }

        return redirect()
            ->route('admin.hadiths.index')
            ->with('status', 'Hadith entry updated.');
    }

    public function destroy(Request $request, Hadith $hadith): RedirectResponse|JsonResponse
    {
        $hadith->delete();

        if ($request->expectsJson()) {
            return $this->messageResponse('Hadith entry removed.');
        }

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

    protected function categoriesToArray($categories): array
    {
        return $categories
            ->map(fn (HadithCategory $category) => [
                'id' => $category->id,
                'name' => $category->name,
            ])
            ->values()
            ->all();
    }

    protected function transformHadith(Hadith $hadith): array
    {
        $hadith->loadMissing('category');

        return [
            'id' => $hadith->id,
            'hadith_category_id' => $hadith->hadith_category_id,
            'title' => $hadith->title,
            'text_ar' => $hadith->text_ar,
            'text_bn' => $hadith->text_bn,
            'reference' => $hadith->reference,
            'sort_order' => (int) $hadith->sort_order,
            'is_active' => (bool) $hadith->is_active,
            'category' => $hadith->category ? [
                'id' => $hadith->category->id,
                'name' => $hadith->category->name,
            ] : null,
            'created_at' => optional($hadith->created_at)->toIso8601String(),
            'updated_at' => optional($hadith->updated_at)->toIso8601String(),
        ];
    }
}
