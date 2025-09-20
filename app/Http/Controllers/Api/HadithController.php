<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\HadithResource;
use App\Models\Hadith;
use App\Models\HadithCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class HadithController extends Controller
{
    public function categories(Request $request)
    {
        $categories = HadithCategory::query()
            ->active()
            ->ordered()
            ->withCount('hadiths')
            ->get();

        $data = CategoryResource::collection($categories)->resolve();

        $uncategorisedCount = Hadith::query()->active()->whereNull('hadith_category_id')->count();
        if ($uncategorisedCount > 0) {
            $data[] = [
                'id' => null,
                'slug' => 'uncategorised',
                'name' => 'অন্যান্য',
                'description' => 'যেসব হাদিস এখনও কোনও সংগ্রহে নেই।',
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

        $query = Hadith::query()
            ->with('category:id,name,slug')
            ->active()
            ->ordered();

        if ($category = trim((string) $request->query('category'))) {
            if ($category === 'uncategorised') {
                $query->whereNull('hadith_category_id');
            } elseif ($category !== 'all') {
                $categoryModel = HadithCategory::query()
                    ->where('slug', $category)
                    ->orWhere('id', is_numeric($category) ? (int) $category : null)
                    ->first();
                if ($categoryModel) {
                    $query->where('hadith_category_id', $categoryModel->id);
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
                    ->orWhereRaw('LOWER(COALESCE(reference, "")) LIKE ?', ["%{$normalized}%"]);
            });
        }

        $hadiths = $query->paginate($perPage);

        return HadithResource::collection($hadiths);
    }
}
