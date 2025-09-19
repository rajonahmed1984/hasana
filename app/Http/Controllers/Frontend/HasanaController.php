<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Ayah;
use App\Models\Surah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Illuminate\View\View;

class HasanaController extends Controller
{
    public function index(): RedirectResponse
    {
        return redirect()->route('hasana.home');
    }

    public function home(): View
    {
        $verseOfDay = $this->resolveVerseOfDay();

        return view('frontend.hasana.home', compact('verseOfDay'));
    }

    public function quran(): View
    {
        $surahs = Surah::withCount('ayahs')
            ->orderBy('number')
            ->get();

        return view('frontend.hasana.quran', compact('surahs'));
    }

    public function surah(Surah $surah): View
    {
        $surah->load(['ayahs' => fn ($query) => $query->orderBy('number')]);

        return view('frontend.hasana.surah', compact('surah'));
    }

    protected function resolveVerseOfDay(): ?array
    {
        $query = Ayah::query()
            ->with('surah')
            ->where('is_active', true);

        $count = (clone $query)->count();
        if ($count === 0) {
            return null;
        }

        $offset = Carbon::today()->dayOfYear % $count;

        $ayah = (clone $query)
            ->orderBy('surah_id')
            ->orderBy('number')
            ->skip($offset)
            ->first();

        if (!$ayah) {
            $ayah = $query->inRandomOrder()->first();
        }

        if (!$ayah) {
            return null;
        }

        $surah = $ayah->surah;
        $reference = $surah
            ? sprintf('সূরা %s (%d:%d)', $surah->name_ar ?: $surah->name_en, $surah->number, $ayah->number)
            : sprintf('আয়াত %d', $ayah->number);

        return [
            'title' => 'আজকের দিনের আয়াত',
            'text' => $ayah->text_bn ?: $ayah->text_ar,
            'reference' => $reference,
        ];
    }
}
