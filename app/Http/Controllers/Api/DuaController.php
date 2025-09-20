<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\DuaResource;
use App\Models\Dua;
use App\Models\DuaCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DuaController extends Controller
{
    public function categories(Request $request)
    {
        $categories = DuaCategory::query()
            ->active()
            ->ordered()
            ->withCount('duas')
            ->get();

        $data = CategoryResource::collection($categories)->resolve();

        $uncategorisedCount = Dua::query()->active()->whereNull('dua_category_id')->count();
        if ($uncategorisedCount > 0) {
            $data[] = [
                'id' => null,
                'slug' => 'uncategorised',
                'name' => 'অন্যান্য',
                'description' => 'যেসব দোআ এখনও কোনও ক্যাটাগরিতে নেই।',
                'sort_order' => 999,
                'is_active' => true,
                'items_count' => $uncategorisedCount,
            ];
        }

        return response()->json(['data' => $data]);
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 12);
        $perPage = max(5, min($perPage, 100));

        $query = Dua::query()
            ->with('category:id,name,slug')
            ->active()
            ->ordered();

        if ($category = trim((string) $request->query('category'))) {
            if ($category === 'uncategorised') {
                $query->whereNull('dua_category_id');
            } elseif ($category !== 'all') {
                $categoryModel = DuaCategory::query()
                    ->where('slug', $category)
                    ->orWhere('id', is_numeric($category) ? (int) $category : null)
                    ->first();
                if ($categoryModel) {
                    $query->where('dua_category_id', $categoryModel->id);
                }
            }
        }

        if ($search = trim((string) $request->query('query'))) {
            $normalized = Str::lower($search);
            $query->where(function (Builder $builder) use ($normalized) {
                $builder
                    ->whereRaw('LOWER(title) LIKE ?', ["%{$normalized}%"])
                    ->orWhereRaw('LOWER(COALESCE(text_bn, "")) LIKE ?', ["%{$normalized}%"])
                    ->orWhereRaw('LOWER(COALESCE(text_ar, "")) LIKE ?', ["%{$normalized}%"])
                    ->orWhereRaw('LOWER(COALESCE(transliteration, "")) LIKE ?', ["%{$normalized}%"])
                    ->orWhereRaw('LOWER(COALESCE(reference, "")) LIKE ?', ["%{$normalized}%"]);
            });
        }

        $duas = $query->paginate($perPage);

        return DuaResource::collection($duas);
    }
}
