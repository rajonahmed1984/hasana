<?php

namespace App\Http\Controllers\Hasana;

use App\Http\Controllers\Controller;
use App\Models\Surah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class HasanaController extends Controller
{
    public function index(): RedirectResponse
    {
        return redirect()->route('hasana.home');
    }

    public function home(): View
    {
        $surahs = Surah::withCount('ayahs')
            ->orderBy('number')
            ->get();

        return view('hasana.home', compact('surahs'));
    }

    public function surah(Surah $surah): View
    {
        $surah->load(['ayahs' => fn ($query) => $query->orderBy('number')]);

        return view('hasana.surah', compact('surah'));
    }
}
