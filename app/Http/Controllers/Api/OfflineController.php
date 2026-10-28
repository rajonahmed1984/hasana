<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AyahResource;
use App\Http\Resources\DuaResource;
use App\Http\Resources\HadithResource;
use App\Http\Resources\SurahDetailResource;
use App\Http\Resources\SurahSummaryResource;
use App\Models\Dua;
use App\Models\Hadith;
use App\Models\HadithCategory;
use App\Models\Surah;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Bulk data packs that the app downloads once and keeps on the device for offline reading.
 * Each pack is a single request (instead of hundreds of paginated ones).
 */
class OfflineController extends Controller
{
    /**
     * The whole Quran: surah list plus every surah with all its ayahs.
     */
    public function quran(Request $request): JsonResponse
    {
        // Building this takes several seconds, so it is cached; admin edits show up within the hour
        $pack = Cache::remember('offline-pack:quran', now()->addHour(), function () use ($request) {
            $surahs = Surah::query()
                ->withCount('ayahs')
                ->with(['ayahs' => fn ($q) => $q->orderBy('number')])
                ->orderBy('number')
                ->get();

            return [
                'generated_at' => now()->toIso8601String(),
                'list' => SurahSummaryResource::collection($surahs)->resolve($request),
                'surahs' => $surahs->map(fn (Surah $surah) => [
                    'data' => (new SurahDetailResource($surah))->resolve($request),
                    'ayahs' => AyahResource::collection($surah->ayahs)->resolve($request),
                ])->values()->all(),
            ];
        });

        return response()->json($pack, 200, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * All hadiths of one category (slug, or "uncategorised").
     */
    public function hadiths(Request $request, string $category): JsonResponse
    {
        $query = Hadith::query()
            ->with('category:id,name,slug')
            ->active()
            ->ordered();

        if ($category === 'uncategorised') {
            $query->whereNull('hadith_category_id');
        } else {
            $categoryModel = HadithCategory::query()->where('slug', $category)->firstOrFail();
            $query->where('hadith_category_id', $categoryModel->id);
        }

        return response()->json([
            'generated_at' => now()->toIso8601String(),
            'category' => $category,
            'data' => HadithResource::collection($query->get())->resolve($request),
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Every active dua (the category list comes from /api/dua/categories).
     */
    public function duas(Request $request): JsonResponse
    {
        $duas = Dua::query()
            ->with('category:id,name,slug')
            ->active()
            ->ordered()
            ->get();

        return response()->json([
            'generated_at' => now()->toIso8601String(),
            'data' => DuaResource::collection($duas)->resolve($request),
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }
}
