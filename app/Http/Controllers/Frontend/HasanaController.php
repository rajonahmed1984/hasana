<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Ayah;
use App\Models\Surah;
use App\Models\Hadith;
use App\Models\Dua;
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

    public function hadiths(): View
    {
        $hadiths = Hadith::query()
            ->where('is_active', true)
            ->latest('id')
            ->paginate(20);

        return view('frontend.hasana.hadiths', compact('hadiths'));
    }

    public function duas(): View
    {
        $duas = Dua::query()
            ->where('is_active', true)
            ->latest('id')
            ->paginate(20);

        return view('frontend.hasana.duas', compact('duas'));
    }

    public function umrah(): View
    {
        return view('frontend.hasana.umrah');
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
            ? sprintf('à¦¸à§‚à¦°à¦¾ %s (%d:%d)', $surah->name_ar ?: $surah->name_en, $surah->number, $ayah->number)
            : sprintf('à¦†à§Ÿà¦¾à¦¤ %d', $ayah->number);

        return [
            'title' => 'à¦†à¦œà¦•à§‡à¦° à¦¦à¦¿à¦¨à§‡à¦° à¦†à§Ÿà¦¾à¦¤',
            'text' => $ayah->text_bn ?: $ayah->text_ar,
            'reference' => $reference,
        ];
    }
}


