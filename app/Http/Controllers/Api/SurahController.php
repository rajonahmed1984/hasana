<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AyahResource;
use App\Http\Resources\SurahDetailResource;
use App\Http\Resources\SurahSummaryResource;
use App\Models\Surah;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SurahController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 30);
        $perPage = max(5, min($perPage, 100));

        $query = Surah::query()->withCount('ayahs');

        if ($search = trim((string) $request->query('query'))) {
            $normalized = Str::lower($search);

            $query->where(function (Builder $builder) use ($normalized) {
                $builder
                    ->whereRaw('LOWER(name_en) LIKE ?', ["%{$normalized}%"])
                    ->orWhereRaw('LOWER(name_ar) LIKE ?', ["%{$normalized}%"])
                    ->orWhereRaw('LOWER(slug) LIKE ?', ["%{$normalized}%"])
                    ->orWhere('meta->name_bn', 'LIKE', "%{$normalized}%")
                    ->orWhere('meta->name_en', 'LIKE', "%{$normalized}%")
                    ->orWhere('meta->meaning_bn', 'LIKE', "%{$normalized}%");
            });
        }

        $surahs = $query
            ->orderBy('number')
            ->paginate($perPage);

        return SurahSummaryResource::collection($surahs);
    }

    public function show(Request $request, Surah $surah)
    {
        $perPage = (int) $request->query('per_page', 20);
        $perPage = max(5, min($perPage, 100));

        $ayahQuery = $surah->ayahs()->orderBy('number');

        if ($search = trim((string) $request->query('query'))) {
            $normalized = Str::lower($search);
            $ayahQuery->where(function (Builder $builder) use ($normalized) {
                $builder
                    ->whereRaw('LOWER(COALESCE(text_bn, "")) LIKE ?', ["%{$normalized}%"])
                    ->orWhereRaw('LOWER(COALESCE(transliteration, "")) LIKE ?', ["%{$normalized}%"])
                    ->orWhereRaw('LOWER(COALESCE(text_ar, "")) LIKE ?', ["%{$normalized}%"]);
            });
        }

        $ayahs = $ayahQuery->paginate($perPage);

        $ayahData = AyahResource::collection($ayahs)->response($request)->getData(true);

        return (new SurahDetailResource($surah))->additional([
            'ayahs' => $ayahData,
        ]);
    }
}
