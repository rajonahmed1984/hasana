<?php

namespace App\Console\Commands;

use App\Models\Hadith;
use App\Models\HadithCategory;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ImportAllHadiths extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'hadith:import-all 
                            {--fresh : Clear existing hadiths before import}
                            {--book=all : Which book to import (all, bukhari, muslim)}
                            {--limit= : Limit number of hadiths per book for testing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Download and import all hadiths of Sahih Bukhari and Sahih Muslim category-wise into the database';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        ini_set('memory_limit', '1536M');
        set_time_limit(0);

        $this->info('===========================================================');
        $this->info('  সহীহ বুখারী ও সহীহ মুসলিম ক্যাটাগরিভিত্তিক হাদিস ইম্পোর্টার');
        $this->info('===========================================================');

        // 1. Create or ensure all topic categories exist
        $this->info('১/৪: বিষয়ভিত্তিক ক্যাটাগরিসমূহ প্রস্তুত করা হচ্ছে...');
        $categoryMap = $this->setupCategories();

        $cacheDir = storage_path('app/hadith_cache');
        if (!File::exists($cacheDir)) {
            File::makeDirectory($cacheDir, 0755, true);
        }

        if ($this->option('fresh')) {
            $this->warn('বিদ্যমান হাদিসসমূহ মুছে ফেলা হচ্ছে (--fresh)...');
            Hadith::truncate();
        }

        $bookOption = strtolower($this->option('book') ?? 'all');
        $limit = $this->option('limit') ? (int) $this->option('limit') : null;

        // 2. Import Sahih Bukhari
        if (in_array($bookOption, ['all', 'bukhari'])) {
            $this->importBook(
                'Sahih Bukhari',
                'সহীহ বুখারী',
                'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-bukhari.min.json',
                'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari.min.json',
                $cacheDir . '/ben-bukhari.min.json',
                $cacheDir . '/ara-bukhari.min.json',
                $this->getBukhariBookCategoryMap(),
                $categoryMap,
                $limit
            );
        }

        // 3. Import Sahih Muslim
        if (in_array($bookOption, ['all', 'muslim'])) {
            $this->importBook(
                'Sahih Muslim',
                'সহীহ মুসলিম',
                'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-muslim.min.json',
                'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-muslim.min.json',
                $cacheDir . '/ben-muslim.min.json',
                $cacheDir . '/ara-muslim.min.json',
                $this->getMuslimBookCategoryMap(),
                $categoryMap,
                $limit
            );
        }

        $totalCount = Hadith::count();
        $this->newLine();
        $this->info("আলহামদুলিল্লাহ! সর্বমোট {$totalCount}টি হাদিস সফলভাবে ডেটাবেজে সংরক্ষিত হয়েছে।");
        $this->info('===========================================================');

        return Command::SUCCESS;
    }

    /**
     * Import a single canonical book collection.
     */
    protected function importBook(
        string $bookNameEn,
        string $bookNameBn,
        string $bengaliUrl,
        string $arabicUrl,
        string $bengaliCachePath,
        string $arabicCachePath,
        array $bookCategoryMap,
        array $categoryMap,
        ?int $limit
    ): void {
        $this->newLine();
        $this->info("==> {$bookNameBn} ({$bookNameEn}) ডেটাসেট ডাউনলোড ও লোড করা হচ্ছে...");

        // Download or read from cache
        $bengaliData = $this->fetchOrCacheJson($bengaliUrl, $bengaliCachePath, "{$bookNameBn} বাংলা");
        $arabicData = $this->fetchOrCacheJson($arabicUrl, $arabicCachePath, "{$bookNameBn} আরবি");

        if (!$bengaliData || empty($bengaliData['hadiths'])) {
            $this->error("{$bookNameBn} এর বাংলা ডেটাসেট লোড করা যায়নি!");
            return;
        }

        // Map Arabic hadiths by hadithnumber
        $arabicMap = [];
        if (!empty($arabicData['hadiths'])) {
            foreach ($arabicData['hadiths'] as $arH) {
                $num = $arH['hadithnumber'] ?? null;
                if ($num !== null) {
                    $arabicMap[$num] = $arH['text'] ?? '';
                }
            }
        }

        $bengaliSections = $bengaliData['metadata']['sections'] ?? [];
        $hadiths = $bengaliData['hadiths'];
        if ($limit && $limit > 0) {
            $hadiths = array_slice($hadiths, 0, $limit);
        }

        $total = count($hadiths);
        $this->info("{$bookNameBn} এর মোট {$total}টি হাদিস প্রসেস করা হচ্ছে...");

        $batch = [];
        $batchSize = 400;
        $insertedCount = 0;
        $now = now()->toDateTimeString();

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        foreach ($hadiths as $item) {
            $hadithNum = $item['hadithnumber'] ?? 0;
            $bookNum = $item['reference']['book'] ?? 0;
            $chapterName = $bengaliSections[$bookNum] ?? "অধ্যায় {$bookNum}";

            // Determine Category
            $targetSlug = $bookCategoryMap[$bookNum] ?? 'akhlaq-o-character';
            $categoryId = $categoryMap[$targetSlug] ?? $categoryMap['akhlaq-o-character'];

            $bnText = trim($item['text'] ?? '');
            $arText = trim($arabicMap[$hadithNum] ?? '');

            // Clean title extraction
            $title = $this->generateCleanTitle($bookNameBn, $hadithNum, $bnText);

            // Detailed reference including Islamic Foundation numbering
            $reference = "{$bookNameBn} (ইসলামিক ফাউন্ডেশন) - হাদিস নং {$hadithNum}, অধ্যায়: {$chapterName}";

            $batch[] = [
                'hadith_category_id' => $categoryId,
                'title' => Str::limit($title, 250, '...'),
                'text_ar' => $arText ?: null,
                'text_bn' => $bnText,
                'reference' => Str::limit($reference, 450, '...'),
                'sort_order' => $hadithNum,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            if (count($batch) >= $batchSize) {
                DB::table('hadiths')->insert($batch);
                $insertedCount += count($batch);
                $batch = [];
            }

            $bar->advance();
        }

        if (!empty($batch)) {
            DB::table('hadiths')->insert($batch);
            $insertedCount += count($batch);
        }

        $bar->finish();
        $this->newLine();
        $this->info("✓ {$bookNameBn}: {$insertedCount}টি হাদিস সফলভাবে ক্যাটাগরিভিত্তিক যুক্ত হয়েছে।");
    }

    /**
     * Download or load from cache.
     */
    protected function fetchOrCacheJson(string $url, string $cachePath, string $label): ?array
    {
        if (File::exists($cachePath) && File::size($cachePath) > 50000) {
            $this->line("  [ক্যাশ থেকে লোড]: {$label}");
            $content = File::get($cachePath);
            return json_decode($content, true);
        }

        $this->line("  [ডাউনলোড হচ্ছে]: {$label} ({$url})");
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 180);
        curl_setopt($ch, CURLOPT_ENCODING, '');
        $data = curl_exec($ch);
        $err = curl_error($ch);
        curl_close($ch);

        if ($data === false || !empty($err)) {
            $this->error("  ডাউনলোড ব্যর্থ হয়েছে: {$err}");
            return null;
        }

        File::put($cachePath, $data);
        return json_decode($data, true);
    }

    /**
     * Generate concise Bengali title for hadith.
     */
    protected function generateCleanTitle(string $bookNameBn, int $number, string $text): string
    {
        // Try extracting first narrator line e.g. "আবূ হুরায়রাহ (রাঃ) হতে বর্ণিত"
        if (preg_match('/(?:হতে|থেকে)\s+বর্ণিত/u', $text, $matches, PREG_OFFSET_CAPTURE)) {
            $offset = $matches[0][1];
            $before = mb_substr($text, 0, $offset + 25);
            // Remove initial hadith numbers like "৫৩৭৩."
            $cleanNarrator = preg_replace('/^\s*[\(\[0-9০-৯\.\-—\s\)]+/u', '', $before);
            $cleanNarrator = trim(strip_tags($cleanNarrator));
            if (mb_strlen($cleanNarrator) > 8 && mb_strlen($cleanNarrator) < 80) {
                return "{$bookNameBn} - হাদিস {$number} ({$cleanNarrator})";
            }
        }

        return "{$bookNameBn} - হাদিস নং {$number}";
    }

    /**
     * Ensure all 18 thematic categories exist and return slug => id map.
     */
    protected function setupCategories(): array
    {
        $categories = [
            [
                'name' => 'হারাম খাদ্য ও পানীয়',
                'slug' => 'haram-food-and-drinks',
                'description' => 'সহীহ বুখারী ও সহীহ মুসলিমের সকল খাদ্য, পানীয়, পশু জবাই, শিকার ও নিষিদ্ধ আহার সম্পর্কিত হাদিসসমূহ।',
                'sort_order' => 1,
            ],
            [
                'name' => 'ঈমান ও আকিদা',
                'slug' => 'iman-o-aqeedah',
                'description' => 'ওহীর সূচনা, ঈমানের স্তম্ভসমূহ, তাওহীদ ও আকিদা সম্পর্কিত সকল হাদিস।',
                'sort_order' => 2,
            ],
            [
                'name' => 'সালাত ও পবিত্রতা',
                'slug' => 'salat-o-taharat',
                'description' => 'ওযু, গোসল, তায়াম্মুম, পাঁচ ওয়াক্ত সালাত, জামাত ও নফল নামাজ সংক্রান্ত হাদিসসমূহ।',
                'sort_order' => 3,
            ],
            [
                'name' => 'সিয়াম ও রমজান',
                'slug' => 'siyam-o-ramadan',
                'description' => 'রমজান মাসের রোজা, তারাবীহ, ইতিকাফ ও সিয়ামের মাসায়েল সম্পর্কিত হাদিসসমূহ।',
                'sort_order' => 4,
            ],
            [
                'name' => 'যাকাত ও দান-সদকা',
                'slug' => 'zakat-o-sadqah',
                'description' => 'ফরজ যাকাত, সদকায়ে ফিতর এবং দান-খয়রাতের ফজিলত সংক্রান্ত হাদিসসমূহ।',
                'sort_order' => 5,
            ],
            [
                'name' => 'হজ ও উমরাহ',
                'slug' => 'hajj-o-umrah',
                'description' => 'হজ, উমরাহ, তাওয়াফ ও মক্কা-মদীনার ফজিলত বিষয়ক হাদিসসমূহ।',
                'sort_order' => 6,
            ],
            [
                'name' => 'হালাল উপার্জন ও ব্যবসা',
                'slug' => 'halal-earning-and-trade',
                'description' => 'ব্যবসা-বাণিজ্য, ক্রয়-বিক্রয়, ঋণ, বন্ধক ও হালাল রিজিক অন্বেষণ সম্পর্কিত হাদিসসমূহ।',
                'sort_order' => 7,
            ],
            [
                'name' => 'পারিবারিক জীবন ও বিবাহ',
                'slug' => 'family-and-marriage',
                'description' => 'নিকাহ, মহর, তালাক, স্ত্রীর অধিকার ও সন্তানের লালন-পালন সম্পর্কিত হাদিসসমূহ।',
                'sort_order' => 8,
            ],
            [
                'name' => 'আখলাক ও উত্তম চরিত্র',
                'slug' => 'akhlaq-o-character',
                'description' => 'সদাচরণ, পিতামাতার খেদমত, আত্মীয়তার বন্ধন, সালাম ও সামাজিক শিষ্টাচার বিষয়ক হাদিসসমূহ।',
                'sort_order' => 9,
            ],
            [
                'name' => 'তওবা, দু\'আ ও ইস্তিগফার',
                'slug' => 'tawbah-o-istighfar',
                'description' => 'গুনাহ মাফের দু\'আ, আল্লাহর স্মরণ (যিকির), তাওবাহ ও শপথ বিষয়ক হাদিসসমূহ।',
                'sort_order' => 10,
            ],
            [
                'name' => 'ইলম ও জ্ঞান অর্জন',
                'slug' => 'ilm-o-knowledge',
                'description' => 'কুরআন ও সুন্নাহ শিক্ষা, আলেমদের মর্যাদা ও দ্বীনি জ্ঞানের ফজিলত সংক্রান্ত হাদিসসমূহ।',
                'sort_order' => 11,
            ],
            [
                'name' => 'দুনিয়া বিমুখতা ও তাকওয়া',
                'slug' => 'zuhd-o-taqwa',
                'description' => 'অন্তরের পবিত্রতা (রিক্বাক্ব), জুহদ, বিনয়, পরকাল ও জান্নাত-জাহান্নামের বিবরণ।',
                'sort_order' => 12,
            ],
            [
                'name' => 'চিকিৎসা ও রোগব্যাধি',
                'slug' => 'medicine-and-health',
                'description' => 'সুস্থতা, চিকিৎসা, রোগীর সেবা ও ইসলামী আরোগ্যবিধি বিষয়ক হাদিসসমূহ।',
                'sort_order' => 13,
            ],
            [
                'name' => 'পোশাক ও পরিচ্ছদ',
                'slug' => 'dress-and-adornment',
                'description' => 'শালীন পোশাক, সাজসজ্জা ও অলংকার ব্যবহারের ইসলামী বিধান।',
                'sort_order' => 14,
            ],
            [
                'name' => 'জানাযা ও কবর',
                'slug' => 'janaza-o-grave',
                'description' => 'মৃত্যু, জানাযার সালাত, দাফন-কাফন ও কবর জিয়ারত বিষয়ক হাদিসসমূহ।',
                'sort_order' => 15,
            ],
            [
                'name' => 'নবী ও সাহাবীগণের মর্যাদা',
                'slug' => 'prophets-and-companions',
                'description' => 'নবী-রাসূলগণ, আহলে বাইত ও সাহাবায়ে কেরামের সুমহান মর্যাদা ও জীবনী।',
                'sort_order' => 16,
            ],
            [
                'name' => 'জিহাদ ও নিরাপত্তা',
                'slug' => 'jihad-o-security',
                'description' => 'আল্লাহর পথে সংগ্রাম, দেশের নিরাপত্তা, চুক্তি ও গণিমত বিষয়ক হাদিসসমূহ।',
                'sort_order' => 17,
            ],
            [
                'name' => 'বিচার ও আইন',
                'slug' => 'law-and-judgments',
                'description' => 'ইসলামী বিচারব্যবস্থা, হুদূদ বা দণ্ডবিধি ও উত্তরাধিকার (ফারায়েয) সংক্রান্ত হাদিসসমূহ।',
                'sort_order' => 18,
            ],
        ];

        $map = [];
        foreach ($categories as $cat) {
            $model = HadithCategory::updateOrCreate(
                ['slug' => $cat['slug']],
                [
                    'name' => $cat['name'],
                    'description' => $cat['description'],
                    'sort_order' => $cat['sort_order'],
                    'is_active' => true,
                ]
            );
            $map[$cat['slug']] = $model->id;
        }

        // Deactivate old book-level categories so they don't confuse frontend
        HadithCategory::whereIn('slug', ['sahih-bukhari', 'sahih-muslim'])->update(['is_active' => false]);

        return $map;
    }

    /**
     * Map all 97 Bukhari books to target category slugs.
     */
    protected function getBukhariBookCategoryMap(): array
    {
        return [
            // হারাম ও হালাল খাদ্য, পানীয় ও কুরবানী
            70 => 'haram-food-and-drinks', // Food, Meals
            71 => 'haram-food-and-drinks', // `Aqiqa
            72 => 'haram-food-and-drinks', // Hunting, Slaughtering
            73 => 'haram-food-and-drinks', // Al-Adha Festival Sacrifice
            74 => 'haram-food-and-drinks', // Drinks

            // ঈমান ও আকিদা
            1 => 'iman-o-aqeedah',  // Revelation
            2 => 'iman-o-aqeedah',  // Belief
            97 => 'iman-o-aqeedah', // Tawheed

            // সালাত ও পবিত্রতা
            4 => 'salat-o-taharat', // Wudu'
            5 => 'salat-o-taharat', // Ghusl
            6 => 'salat-o-taharat', // Menstrual Periods
            7 => 'salat-o-taharat', // Tayammum
            8 => 'salat-o-taharat', // Prayers (Salat)
            9 => 'salat-o-taharat', // Times of Prayers
            10 => 'salat-o-taharat', // Adhaan
            11 => 'salat-o-taharat', // Friday Prayer
            12 => 'salat-o-taharat', // Fear Prayer
            13 => 'salat-o-taharat', // Eids
            14 => 'salat-o-taharat', // Witr
            15 => 'salat-o-taharat', // Rain (Istisqaa)
            16 => 'salat-o-taharat', // Eclipses
            17 => 'salat-o-taharat', // Prostration During Recital
            18 => 'salat-o-taharat', // Shortening Prayers
            19 => 'salat-o-taharat', // Tahajjud
            20 => 'salat-o-taharat', // Virtues of Prayer at Makkah & Madinah
            21 => 'salat-o-taharat', // Actions while Praying
            22 => 'salat-o-taharat', // Forgetfulness in Prayer

            // জানাযা
            23 => 'janaza-o-grave', // Funerals

            // যাকাত
            24 => 'zakat-o-sadqah', // Zakat

            // হজ ও উমরাহ
            25 => 'hajj-o-umrah', // Hajj
            26 => 'hajj-o-umrah', // `Umrah
            27 => 'hajj-o-umrah', // Pilgrims Prevented
            28 => 'hajj-o-umrah', // Penalty of Hunting
            29 => 'hajj-o-umrah', // Virtues of Madinah

            // সিয়াম
            30 => 'siyam-o-ramadan', // Fasting
            31 => 'siyam-o-ramadan', // Taraweeh
            32 => 'siyam-o-ramadan', // Night of Qadr
            33 => 'siyam-o-ramadan', // I'tikaf

            // হালাল উপার্জন ও ব্যবসা
            34 => 'halal-earning-and-trade', // Sales and Trade
            35 => 'halal-earning-and-trade', // As-Salam
            36 => 'halal-earning-and-trade', // Shuf'a
            37 => 'halal-earning-and-trade', // Hiring
            38 => 'halal-earning-and-trade', // Transferance of Debt
            39 => 'halal-earning-and-trade', // Kafalah
            40 => 'halal-earning-and-trade', // Business by Proxy
            41 => 'halal-earning-and-trade', // Agriculture
            42 => 'halal-earning-and-trade', // Distribution of Water
            43 => 'halal-earning-and-trade', // Loans and Bankruptcy
            44 => 'halal-earning-and-trade', // Khusoomaat
            45 => 'halal-earning-and-trade', // Lost Things
            46 => 'halal-earning-and-trade', // Oppressions
            47 => 'halal-earning-and-trade', // Partnership
            48 => 'halal-earning-and-trade', // Mortgaging
            49 => 'halal-earning-and-trade', // Manumission
            50 => 'halal-earning-and-trade', // Makaatib
            51 => 'halal-earning-and-trade', // Gifts
            52 => 'halal-earning-and-trade', // Witnesses
            53 => 'halal-earning-and-trade', // Peacemaking
            54 => 'halal-earning-and-trade', // Conditions
            55 => 'halal-earning-and-trade', // Wills

            // জিহাদ ও নিরাপত্তা
            56 => 'jihad-o-security', // Jihaad
            57 => 'jihad-o-security', // Khumus
            58 => 'jihad-o-security', // Jizyah

            // নবী ও সাহাবীগণ
            59 => 'prophets-and-companions', // Creation
            60 => 'prophets-and-companions', // Prophets
            61 => 'prophets-and-companions', // Virtues of Prophet
            62 => 'prophets-and-companions', // Companions
            63 => 'prophets-and-companions', // Ansaar
            64 => 'prophets-and-companions', // Maghaazi

            // ইলম ও কুরআন
            3 => 'ilm-o-knowledge',  // Knowledge
            65 => 'ilm-o-knowledge', // Tafseer
            66 => 'ilm-o-knowledge', // Virtues of Qur'an
            95 => 'ilm-o-knowledge', // Accepting Information
            96 => 'ilm-o-knowledge', // Holding Fast to Sunnah

            // পরিবার ও বিবাহ
            67 => 'family-and-marriage', // Marriage
            68 => 'family-and-marriage', // Divorce
            69 => 'family-and-marriage', // Supporting Family
            82 => 'family-and-marriage', // Suckling

            // চিকিৎসা
            75 => 'medicine-and-health', // Patients
            76 => 'medicine-and-health', // Medicine

            // পোশাক
            77 => 'dress-and-adornment', // Dress

            // আখলাক
            78 => 'akhlaq-o-character', // Good Manners (Adab)
            79 => 'akhlaq-o-character', // Asking Permission
            90 => 'akhlaq-o-character', // Tricks

            // তওবা ও দু'আ
            80 => 'tawbah-o-istighfar', // Invocations
            83 => 'tawbah-o-istighfar', // Oaths and Vows
            84 => 'tawbah-o-istighfar', // Expiation for Oaths

            // তাকওয়া ও জুহদ
            81 => 'zuhd-o-taqwa', // Ar-Riqaq
            91 => 'zuhd-o-taqwa', // Interpretation of Dreams
            92 => 'zuhd-o-taqwa', // Afflictions and End of World
            94 => 'zuhd-o-taqwa', // Wishes

            // আইন ও বিচার
            85 => 'law-and-judgments', // Laws of Inheritance
            86 => 'law-and-judgments', // Limits & Punishments (Hudood)
            87 => 'law-and-judgments', // Blood Money (Diyat)
            88 => 'law-and-judgments', // Apostates
            89 => 'law-and-judgments', // Coercion
            93 => 'law-and-judgments', // Judgments (Ahkaam)
        ];
    }

    /**
     * Map all 56 Muslim books to target category slugs.
     */
    protected function getMuslimBookCategoryMap(): array
    {
        return [
            // খাদ্য ও পানীয়
            34 => 'haram-food-and-drinks', // Hunting, Slaughter and what may be Eaten
            35 => 'haram-food-and-drinks', // Sacrifices
            36 => 'haram-food-and-drinks', // Drinks

            // ঈমান
            0 => 'iman-o-aqeedah', // Introduction
            1 => 'iman-o-aqeedah', // Faith

            // সালাত ও পবিত্রতা
            2 => 'salat-o-taharat', // Purification
            3 => 'salat-o-taharat', // Menstruation
            4 => 'salat-o-taharat', // Prayers
            5 => 'salat-o-taharat', // Mosques
            6 => 'salat-o-taharat', // Prayer of Travellers
            7 => 'salat-o-taharat', // Friday
            8 => 'salat-o-taharat', // Two Eids
            9 => 'salat-o-taharat', // Rain
            10 => 'salat-o-taharat', // Eclipses

            // জানাযা
            11 => 'janaza-o-grave', // Funerals

            // যাকাত
            12 => 'zakat-o-sadqah', // Zakat

            // সিয়াম
            13 => 'siyam-o-ramadan', // Fasting
            14 => 'siyam-o-ramadan', // I'tikaf

            // হজ
            15 => 'hajj-o-umrah', // Pilgrimage

            // পরিবার ও বিবাহ
            16 => 'family-and-marriage', // Marriage
            17 => 'family-and-marriage', // Suckling
            18 => 'family-and-marriage', // Divorce
            19 => 'family-and-marriage', // Invoking Curses
            20 => 'family-and-marriage', // Emancipating Slaves

            // ব্যবসা ও লেনদেন
            21 => 'halal-earning-and-trade', // Transactions
            22 => 'halal-earning-and-trade', // Musaqah
            24 => 'halal-earning-and-trade', // Gifts
            25 => 'halal-earning-and-trade', // Wills
            26 => 'halal-earning-and-trade', // Vows
            27 => 'halal-earning-and-trade', // Oaths
            31 => 'halal-earning-and-trade', // Lost Property

            // জিহাদ ও নিরাপত্তা
            32 => 'jihad-o-security', // Jihad
            33 => 'jihad-o-security', // Government

            // পোশাক
            37 => 'dress-and-adornment', // Clothes and Adornment

            // আখলাক
            38 => 'akhlaq-o-character', // Manners and Etiquette
            39 => 'akhlaq-o-character', // Greetings
            40 => 'akhlaq-o-character', // Correct Words
            41 => 'akhlaq-o-character', // Poetry
            45 => 'akhlaq-o-character', // Ties of Kinship

            // ইলম ও কুরআন
            47 => 'ilm-o-knowledge', // Knowledge
            56 => 'ilm-o-knowledge', // Commentary on Qur'an

            // তওবা ও যিকির
            48 => 'tawbah-o-istighfar', // Remembrance, Du'a, Repentance
            50 => 'tawbah-o-istighfar', // Repentance

            // নবী ও সাহাবীগণ
            43 => 'prophets-and-companions', // Virtues
            44 => 'prophets-and-companions', // Merits of Companions

            // তাকওয়া ও আখিরাত
            42 => 'zuhd-o-taqwa', // Dreams
            46 => 'zuhd-o-taqwa', // Destiny
            49 => 'zuhd-o-taqwa', // Heart-Melting
            51 => 'zuhd-o-taqwa', // Hypocrites
            52 => 'zuhd-o-taqwa', // Day of Judgment
            53 => 'zuhd-o-taqwa', // Paradise
            54 => 'zuhd-o-taqwa', // Tribulations
            55 => 'zuhd-o-taqwa', // Zuhd

            // আইন ও বিচার
            23 => 'law-and-judgments', // Rules of Inheritance
            28 => 'law-and-judgments', // Retaliation & Diyat
            29 => 'law-and-judgments', // Punishments
            30 => 'law-and-judgments', // Judicial Decisions
        ];
    }
}
