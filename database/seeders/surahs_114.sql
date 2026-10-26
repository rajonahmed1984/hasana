-- 114 Surahs for Quran Sharif Sohoj Shorol Bangla Onubad
-- Target Database: hasana / rajonhasanaa_lara859

INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (1, 'الفاتحة', 'Al-Fatihah', 'al-fatiha', 'meccan', 7, '{"name_bn": "আল-ফাতিহা", "meaning_bn": "সূচনা", "revelation_order": 5, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (2, 'البقرة', 'Al-Baqarah', 'al-baqarah', 'medinan', 286, '{"name_bn": "আল-বাকারা", "meaning_bn": "বকনা-বাছুর", "revelation_order": 87, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (3, 'آل عمران', 'Ali ''Imran', 'al-imran', 'medinan', 200, '{"name_bn": "আল-ইমরান", "meaning_bn": "ইমরানের পরিবার", "revelation_order": 89, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (4, 'النساء', 'An-Nisa', 'an-nisa', 'medinan', 176, '{"name_bn": "আন-নিসা", "meaning_bn": "নারী", "revelation_order": 92, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (5, 'المائدة', 'Al-Ma''idah', 'al-maidah', 'medinan', 120, '{"name_bn": "আল-মায়েদাহ", "meaning_bn": "খাদ্য পরিবেশিত টেবিল", "revelation_order": 112, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (6, 'الأنعام', 'Al-An''am', 'al-an-am', 'meccan', 165, '{"name_bn": "আল-আনআম", "meaning_bn": "গৃহপালিত পশু", "revelation_order": 55, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (7, 'الأعراف', 'Al-A''raf', 'al-a-raf', 'meccan', 206, '{"name_bn": "আল-আ''রাফ", "meaning_bn": "উঁচু স্থানসমূহ", "revelation_order": 39, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (8, 'الأنفال', 'Al-Anfal', 'al-anfal', 'medinan', 75, '{"name_bn": "আল-আনফাল", "meaning_bn": "যুদ্ধলব্ধ ধন-সম্পদ", "revelation_order": 88, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (9, 'التوبة', 'At-Tawbah', 'at-tawbah', 'medinan', 129, '{"name_bn": "আত-তাওবাহ", "meaning_bn": "অনুশোচনা", "revelation_order": 113, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (10, 'يونس', 'Yunus', 'yunus', 'meccan', 109, '{"name_bn": "ইউনুস", "meaning_bn": "নবী ইউনুস", "revelation_order": 51, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (11, 'هود', 'Hud', 'hud', 'meccan', 123, '{"name_bn": "হুদ", "meaning_bn": "নবী হুদ", "revelation_order": 52, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (12, 'يوسف', 'Yusuf', 'yusuf', 'meccan', 111, '{"name_bn": "ইউসুফ", "meaning_bn": "নবী ইউসুফ", "revelation_order": 53, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (13, 'الرعد', 'Ar-Ra''d', 'ar-ra-d', 'medinan', 43, '{"name_bn": "আর-রা''দ", "meaning_bn": "বজ্রপাত", "revelation_order": 96, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (14, 'ابراهيم', 'Ibrahim', 'ibrahim', 'meccan', 52, '{"name_bn": "ইবরাহীম", "meaning_bn": "নবী ইবরাহীম", "revelation_order": 72, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (15, 'الحجر', 'Al-Hijr', 'al-hijr', 'meccan', 99, '{"name_bn": "আল-হিজর", "meaning_bn": "পাথুরে পাহাড়", "revelation_order": 54, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (16, 'النحل', 'An-Nahl', 'an-nahl', 'meccan', 128, '{"name_bn": "আন-নাহল", "meaning_bn": "মৌমাছি", "revelation_order": 70, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (17, 'الإسراء', 'Al-Isra', 'al-isra', 'meccan', 111, '{"name_bn": "বনী ইসরাঈল", "meaning_bn": "রাতের ভ্রমণ (বনী ইসরাঈল)", "revelation_order": 50, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (18, 'الكهف', 'Al-Kahf', 'al-kahf', 'meccan', 110, '{"name_bn": "আল-কাহফ", "meaning_bn": "গুহা", "revelation_order": 69, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (19, 'مريم', 'Maryam', 'maryam', 'meccan', 98, '{"name_bn": "মারইয়াম", "meaning_bn": "মারইয়াম", "revelation_order": 44, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (20, 'طه', 'Taha', 'taha', 'meccan', 135, '{"name_bn": "ত্বাহা", "meaning_bn": "ত্বা-হা", "revelation_order": 45, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (21, 'الأنبياء', 'Al-Anbya', 'al-anbya', 'meccan', 112, '{"name_bn": "আল-আম্বিয়া", "meaning_bn": "নবীগণ", "revelation_order": 73, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (22, 'الحج', 'Al-Hajj', 'al-hajj', 'medinan', 78, '{"name_bn": "আল-হাজ্জ", "meaning_bn": "হজ্জ", "revelation_order": 103, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (23, 'المؤمنون', 'Al-Mu''minun', 'al-mu-minun', 'meccan', 118, '{"name_bn": "আল-মুমিনূন", "meaning_bn": "বিশ্বাসীগণ", "revelation_order": 74, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (24, 'النور', 'An-Nur', 'an-nur', 'medinan', 64, '{"name_bn": "আন-নূর", "meaning_bn": "জ্যোতি", "revelation_order": 102, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (25, 'الفرقان', 'Al-Furqan', 'al-furqan', 'meccan', 77, '{"name_bn": "আল-ফুরকান", "meaning_bn": "সত্য-মিথ্যার পার্থক্যকারী", "revelation_order": 42, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (26, 'الشعراء', 'Ash-Shu''ara', 'ash-shu-ara', 'meccan', 227, '{"name_bn": "আশ-শুআরা", "meaning_bn": "কবিগণ", "revelation_order": 47, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (27, 'النمل', 'An-Naml', 'an-naml', 'meccan', 93, '{"name_bn": "আন-নামল", "meaning_bn": "পিঁপড়া", "revelation_order": 48, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (28, 'القصص', 'Al-Qasas', 'al-qasas', 'meccan', 88, '{"name_bn": "আল-কাসাস", "meaning_bn": "কাহিনী", "revelation_order": 49, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (29, 'العنكبوت', 'Al-''Ankabut', 'al-ankabut', 'meccan', 69, '{"name_bn": "আল-আনকাবুত", "meaning_bn": "মাকড়সা", "revelation_order": 85, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (30, 'الروم', 'Ar-Rum', 'ar-rum', 'meccan', 60, '{"name_bn": "আর-রূম", "meaning_bn": "রোমান জাতি", "revelation_order": 84, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (31, 'لقمان', 'Luqman', 'luqman', 'meccan', 34, '{"name_bn": "লুকমান", "meaning_bn": "জ্ঞানী লুকমান", "revelation_order": 57, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (32, 'السجدة', 'As-Sajdah', 'as-sajdah', 'meccan', 30, '{"name_bn": "আস-সাজদাহ", "meaning_bn": "সিজদা", "revelation_order": 75, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (33, 'الأحزاب', 'Al-Ahzab', 'al-ahzab', 'medinan', 73, '{"name_bn": "আল-আহযাব", "meaning_bn": "সম্মিলিত বাহিনী", "revelation_order": 90, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (34, 'سبإ', 'Saba', 'saba', 'meccan', 54, '{"name_bn": "সাবা", "meaning_bn": "সাবা জাতি", "revelation_order": 58, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (35, 'فاطر', 'Fatir', 'fatir', 'meccan', 45, '{"name_bn": "ফাতির", "meaning_bn": "আদি স্রষ্টা", "revelation_order": 43, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (36, 'يس', 'Ya-Sin', 'ya-sin', 'meccan', 83, '{"name_bn": "ইয়াসীন", "meaning_bn": "ইয়া-সীন", "revelation_order": 41, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (37, 'الصافات', 'As-Saffat', 'as-saffat', 'meccan', 182, '{"name_bn": "আস-সাফফাত", "meaning_bn": "সারিবদ্ধভাবে দাঁড়ানো", "revelation_order": 56, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (38, 'ص', 'Sad', 'sad', 'meccan', 88, '{"name_bn": "সোয়াদ", "meaning_bn": "সোয়াদ", "revelation_order": 38, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (39, 'الزمر', 'Az-Zumar', 'az-zumar', 'meccan', 75, '{"name_bn": "আজ-যুমার", "meaning_bn": "দলবদ্ধ জনতা", "revelation_order": 59, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (40, 'غافر', 'Ghafir', 'ghafir', 'meccan', 85, '{"name_bn": "আল-মুমিন", "meaning_bn": "বিশ্বাসী", "revelation_order": 60, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (41, 'فصلت', 'Fussilat', 'fussilat', 'meccan', 54, '{"name_bn": "ফুসসিলাত", "meaning_bn": "সুস্পষ্ট বিবরণ", "revelation_order": 61, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (42, 'الشورى', 'Ash-Shuraa', 'ash-shuraa', 'meccan', 53, '{"name_bn": "আশ-শূরা", "meaning_bn": "পরামর্শ", "revelation_order": 62, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (43, 'الزخرف', 'Az-Zukhruf', 'az-zukhruf', 'meccan', 89, '{"name_bn": "আজ-যুখরুফ", "meaning_bn": "স্বর্ণালঙ্কার", "revelation_order": 63, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (44, 'الدخان', 'Ad-Dukhan', 'ad-dukhan', 'meccan', 59, '{"name_bn": "আদ-দুখান", "meaning_bn": "ধোঁয়া", "revelation_order": 64, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (45, 'الجاثية', 'Al-Jathiyah', 'al-jathiyah', 'meccan', 37, '{"name_bn": "আল-জাসিয়াহ", "meaning_bn": "নতজানু", "revelation_order": 65, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (46, 'الأحقاف', 'Al-Ahqaf', 'al-ahqaf', 'meccan', 35, '{"name_bn": "আল-আহকাফ", "meaning_bn": "বালির পাহাড়", "revelation_order": 66, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (47, 'محمد', 'Muhammad', 'muhammad', 'medinan', 38, '{"name_bn": "মুহাম্মদ", "meaning_bn": "মুহাম্মদ (সা.)", "revelation_order": 95, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (48, 'الفتح', 'Al-Fath', 'al-fath', 'medinan', 29, '{"name_bn": "আল-ফাতহ", "meaning_bn": "বিজয়", "revelation_order": 111, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (49, 'الحجرات', 'Al-Hujurat', 'al-hujurat', 'medinan', 18, '{"name_bn": "আল-হুজুরাত", "meaning_bn": "বাসস্থানসমূহ", "revelation_order": 106, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (50, 'ق', 'Qaf', 'qaf', 'meccan', 45, '{"name_bn": "ক্বাফ", "meaning_bn": "ক্বাফ", "revelation_order": 34, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (51, 'الذاريات', 'Adh-Dhariyat', 'adh-dhariyat', 'meccan', 60, '{"name_bn": "আজ-যারিয়াত", "meaning_bn": "বিক্ষেপকারী বাতাস", "revelation_order": 67, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (52, 'الطور', 'At-Tur', 'at-tur', 'meccan', 49, '{"name_bn": "আত-তূর", "meaning_bn": "তূর পর্বত", "revelation_order": 76, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (53, 'النجم', 'An-Najm', 'an-najm', 'meccan', 62, '{"name_bn": "আন-নাজম", "meaning_bn": "তারা (নক্ষত্র)", "revelation_order": 23, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (54, 'القمر', 'Al-Qamar', 'al-qamar', 'meccan', 55, '{"name_bn": "আল-ক্বামার", "meaning_bn": "চাঁদ", "revelation_order": 37, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (55, 'الرحمن', 'Ar-Rahman', 'ar-rahman', 'medinan', 78, '{"name_bn": "আর-রহমান", "meaning_bn": "পরম করুণাময়", "revelation_order": 97, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (56, 'الواقعة', 'Al-Waqi''ah', 'al-waqi-ah', 'meccan', 96, '{"name_bn": "আল-ওয়াকিয়াহ", "meaning_bn": "নিশ্চিত ঘটনা", "revelation_order": 46, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (57, 'الحديد', 'Al-Hadid', 'al-hadid', 'medinan', 29, '{"name_bn": "আল-হাদীদ", "meaning_bn": "লোহা", "revelation_order": 94, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (58, 'المجادلة', 'Al-Mujadila', 'al-mujadila', 'medinan', 22, '{"name_bn": "আল-মুজাদালাহ", "meaning_bn": "বাদানুবাদকারিণী নারী", "revelation_order": 105, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (59, 'الحشر', 'Al-Hashr', 'al-hashr', 'medinan', 24, '{"name_bn": "আল-হাশর", "meaning_bn": "সমাবেশ", "revelation_order": 101, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (60, 'الممتحنة', 'Al-Mumtahanah', 'al-mumtahanah', 'medinan', 13, '{"name_bn": "আল-মুমতাহানাহ", "meaning_bn": "পরীক্ষিত নারী", "revelation_order": 91, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (61, 'الصف', 'As-Saf', 'as-saf', 'medinan', 14, '{"name_bn": "আস-সাফ", "meaning_bn": "সুসংহত সারি", "revelation_order": 109, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (62, 'الجمعة', 'Al-Jumu''ah', 'al-jumu-ah', 'medinan', 11, '{"name_bn": "আল-জুমুআহ", "meaning_bn": "সম্মেলন (জুমুআ)", "revelation_order": 110, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (63, 'المنافقون', 'Al-Munafiqun', 'al-munafiqun', 'medinan', 11, '{"name_bn": "আল-মুনাফিকুন", "meaning_bn": "কপট বিশ্বাসীগণ", "revelation_order": 104, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (64, 'التغابن', 'At-Taghabun', 'at-taghabun', 'medinan', 18, '{"name_bn": "আত-তাগাবুন", "meaning_bn": "লাভ-ক্ষতি (মোহ উন্মোচন)", "revelation_order": 108, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (65, 'الطلاق', 'At-Talaq', 'at-talaq', 'medinan', 12, '{"name_bn": "আত-তালাক", "meaning_bn": "বিবাহ বিচ্ছেদ", "revelation_order": 99, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (66, 'التحريم', 'At-Tahrim', 'at-tahrim', 'medinan', 12, '{"name_bn": "আত-তাহরীম", "meaning_bn": "নিষিদ্ধকরণ", "revelation_order": 107, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (67, 'الملك', 'Al-Mulk', 'al-mulk', 'meccan', 30, '{"name_bn": "আল-মুলক", "meaning_bn": "সার্বভৌম কর্তৃত্ব", "revelation_order": 77, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (68, 'القلم', 'Al-Qalam', 'al-qalam', 'meccan', 52, '{"name_bn": "আল-ক্বলম", "meaning_bn": "কলম", "revelation_order": 2, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (69, 'الحاقة', 'Al-Haqqah', 'al-haqqah', 'meccan', 52, '{"name_bn": "আল-হাক্কাহ", "meaning_bn": "নিশ্চিত সত্য", "revelation_order": 78, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (70, 'المعارج', 'Al-Ma''arij', 'al-ma-arij', 'meccan', 44, '{"name_bn": "আল-মাআরিজ", "meaning_bn": "উন্নয়নের সোপান", "revelation_order": 79, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (71, 'نوح', 'Nuh', 'nuh', 'meccan', 28, '{"name_bn": "নূহ", "meaning_bn": "নবী নূহ", "revelation_order": 71, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (72, 'الجن', 'Al-Jinn', 'al-jinn', 'meccan', 28, '{"name_bn": "আল-জ্বিন", "meaning_bn": "জ্বিন জাতি", "revelation_order": 40, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (73, 'المزمل', 'Al-Muzzammil', 'al-muzzammil', 'meccan', 20, '{"name_bn": "আল-মুযযাম্মিল", "meaning_bn": "বস্ত্র আচ্ছাদনকারী", "revelation_order": 3, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (74, 'المدثر', 'Al-Muddaththir', 'al-muddaththir', 'meccan', 56, '{"name_bn": "আল-মুদ্দাসসির", "meaning_bn": "পোশাক পরিহিত", "revelation_order": 4, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (75, 'القيامة', 'Al-Qiyamah', 'al-qiyamah', 'meccan', 40, '{"name_bn": "আল-কিয়ামাহ", "meaning_bn": "পুনরুত্থান দিবস", "revelation_order": 31, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (76, 'الانسان', 'Al-Insan', 'al-insan', 'medinan', 31, '{"name_bn": "আল-ইনসান", "meaning_bn": "মানবজাতি (মানুষ)", "revelation_order": 98, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (77, 'المرسلات', 'Al-Mursalat', 'al-mursalat', 'meccan', 50, '{"name_bn": "আল-মুরসালাত", "meaning_bn": "প্রেরিত বাতাস", "revelation_order": 33, "translator_bn": "মাওলানা মুহিউদ্দীন খান (মারেফুল কুরআন)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (78, 'النبإ', 'An-Naba', 'an-naba', 'meccan', 40, '{"name_bn": "আন-নাবা", "meaning_bn": "মহাসংবাদ", "revelation_order": 80, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (79, 'النازعات', 'An-Nazi''at', 'an-nazi-at', 'meccan', 46, '{"name_bn": "আন-নাযিআত", "meaning_bn": "প্রচেষ্টাকারী", "revelation_order": 81, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (80, 'عبس', '''Abasa', 'abasa', 'meccan', 42, '{"name_bn": "আবাসা", "meaning_bn": "সে ভ্রূ কুঁচকালো", "revelation_order": 24, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (81, 'التكوير', 'At-Takwir', 'at-takwir', 'meccan', 29, '{"name_bn": "আত-তাকভীর", "meaning_bn": "অন্ধকারাচ্ছন্নকরণ", "revelation_order": 7, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (82, 'الإنفطار', 'Al-Infitar', 'al-infitar', 'meccan', 19, '{"name_bn": "আল-ইনফিতার", "meaning_bn": "বিদীর্ণ করা", "revelation_order": 82, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (83, 'المطففين', 'Al-Mutaffifin', 'al-mutaffifin', 'meccan', 36, '{"name_bn": "আল-মুতাফফিফীন", "meaning_bn": "প্রতারণা করা (মাপে কম)", "revelation_order": 86, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (84, 'الإنشقاق', 'Al-Inshiqaq', 'al-inshiqaq', 'meccan', 25, '{"name_bn": "আল-ইনশিকাক", "meaning_bn": "খণ্ড-বিখণ্ডকরণ", "revelation_order": 83, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (85, 'البروج', 'Al-Buruj', 'al-buruj', 'meccan', 22, '{"name_bn": "আল-বুরুজ", "meaning_bn": "নক্ষত্রপুঞ্জ", "revelation_order": 27, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (86, 'الطارق', 'At-Tariq', 'at-tariq', 'meccan', 17, '{"name_bn": "আত-তারিক", "meaning_bn": "রাতের আগন্তুক", "revelation_order": 36, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (87, 'الأعلى', 'Al-A''la', 'al-a-la', 'meccan', 19, '{"name_bn": "আল-আ''লা", "meaning_bn": "সর্বোন্নত", "revelation_order": 8, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (88, 'الغاشية', 'Al-Ghashiyah', 'al-ghashiyah', 'meccan', 26, '{"name_bn": "আল-গাশিয়াহ", "meaning_bn": "বিহ্বলকর ঘটনা", "revelation_order": 68, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (89, 'الفجر', 'Al-Fajr', 'al-fajr', 'meccan', 30, '{"name_bn": "আল-ফজর", "meaning_bn": "ভোরবেলা", "revelation_order": 10, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (90, 'البلد', 'Al-Balad', 'al-balad', 'meccan', 20, '{"name_bn": "আল-বালাদ", "meaning_bn": "নগরী", "revelation_order": 35, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (91, 'الشمس', 'Ash-Shams', 'ash-shams', 'meccan', 15, '{"name_bn": "আশ-শামস", "meaning_bn": "সূর্য", "revelation_order": 26, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (92, 'الليل', 'Al-Layl', 'al-layl', 'meccan', 21, '{"name_bn": "আল-লায়ল", "meaning_bn": "রাত", "revelation_order": 9, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (93, 'الضحى', 'Ad-Duhaa', 'ad-duhaa', 'meccan', 11, '{"name_bn": "আদ-দুহা", "meaning_bn": "পূর্বাহ্নের সূর্যকিরণ", "revelation_order": 11, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (94, 'الشرح', 'Ash-Sharh', 'ash-sharh', 'meccan', 8, '{"name_bn": "আল-ইনশিরাহ", "meaning_bn": "বক্ষ প্রশস্তকরণ", "revelation_order": 12, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (95, 'التين', 'At-Tin', 'at-tin', 'meccan', 8, '{"name_bn": "আত-তীন", "meaning_bn": "ডুমুর (আঞ্জীর)", "revelation_order": 28, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (96, 'العلق', 'Al-''Alaq', 'al-alaq', 'meccan', 19, '{"name_bn": "আল-আলাক", "meaning_bn": "রক্তপিণ্ড", "revelation_order": 1, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (97, 'القدر', 'Al-Qadr', 'al-qadr', 'meccan', 5, '{"name_bn": "আল-ক্বদর", "meaning_bn": "মহিমান্বিত রজনী", "revelation_order": 25, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (98, 'البينة', 'Al-Bayyinah', 'al-bayyinah', 'medinan', 8, '{"name_bn": "আল-বাইয়্যিনাহ", "meaning_bn": "সুস্পষ্ট প্রমাণ", "revelation_order": 100, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (99, 'الزلزلة', 'Az-Zalzalah', 'az-zalzalah', 'medinan', 8, '{"name_bn": "আল-যিলযাল", "meaning_bn": "মহাকম্পন", "revelation_order": 93, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (100, 'العاديات', 'Al-''Adiyat', 'al-adiyat', 'meccan', 11, '{"name_bn": "আল-আদিয়াত", "meaning_bn": "অভিযানকারী অশ্ব", "revelation_order": 14, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (101, 'القارعة', 'Al-Qari''ah', 'al-qari-ah', 'meccan', 11, '{"name_bn": "আল-কারিয়াহ", "meaning_bn": "মহাসংকট", "revelation_order": 30, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (102, 'التكاثر', 'At-Takathur', 'at-takathur', 'meccan', 8, '{"name_bn": "আত-তাকাসুর", "meaning_bn": "প্রাচুর্যের মোহ", "revelation_order": 16, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (103, 'العصر', 'Al-''Asr', 'al-asr', 'meccan', 3, '{"name_bn": "আল-আসর", "meaning_bn": "মহাকাল (সময়)", "revelation_order": 13, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (104, 'الهمزة', 'Al-Humazah', 'al-humazah', 'meccan', 9, '{"name_bn": "আল-হুমাযাহ", "meaning_bn": "পরনিন্দাকারী", "revelation_order": 32, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (105, 'الفيل', 'Al-Fil', 'al-fil', 'meccan', 5, '{"name_bn": "আল-ফীল", "meaning_bn": "হাতি", "revelation_order": 19, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (106, 'قريش', 'Quraysh', 'quraysh', 'meccan', 4, '{"name_bn": "কুরাইশ", "meaning_bn": "কুরাইশ গোত্র", "revelation_order": 29, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (107, 'الماعون', 'Al-Ma''un', 'al-ma-un', 'meccan', 7, '{"name_bn": "আল-মাউন", "meaning_bn": "সাহায্য সহায়তা", "revelation_order": 17, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (108, 'الكوثر', 'Al-Kawthar', 'al-kawthar', 'meccan', 3, '{"name_bn": "আল-কাউসার", "meaning_bn": "প্রাচুর্য", "revelation_order": 15, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (109, 'الكافرون', 'Al-Kafirun', 'al-kafirun', 'meccan', 6, '{"name_bn": "আল-কাফিরূন", "meaning_bn": "অবিশ্বাসীগণ", "revelation_order": 18, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (110, 'النصر', 'An-Nasr', 'an-nasr', 'medinan', 3, '{"name_bn": "আন-নাসর", "meaning_bn": "বিজয় ও সাহায্য", "revelation_order": 114, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (111, 'المسد', 'Al-Masad', 'al-masad', 'meccan', 5, '{"name_bn": "আল-লাহাব", "meaning_bn": "জ্বলন্ত অঙ্গার", "revelation_order": 6, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (112, 'الإخلاص', 'Al-Ikhlas', 'al-ikhlas', 'meccan', 4, '{"name_bn": "আল-ইখলাস", "meaning_bn": "একনিষ্ঠতা", "revelation_order": 22, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (113, 'الفلق', 'Al-Falaq', 'al-falaq', 'meccan', 5, '{"name_bn": "আল-ফালাক", "meaning_bn": "নিশিভোর", "revelation_order": 20, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
INSERT INTO surahs (`number`, `name_ar`, `name_en`, `slug`, `revelation_type`, `ayah_count`, `meta`, `created_at`, `updated_at`)
VALUES (114, 'الناس', 'An-Nas', 'an-nas', 'meccan', 6, '{"name_bn": "আন-নাস", "meaning_bn": "মানবজাতি", "revelation_order": 21, "translator_bn": "হাফেজ মুনির উদ্দীন আহমদ (সহজ সরল বাংলা অনুবাদ)"}', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `name_ar` = VALUES(`name_ar`),
    `name_en` = VALUES(`name_en`),
    `slug` = VALUES(`slug`),
    `revelation_type` = VALUES(`revelation_type`),
    `ayah_count` = VALUES(`ayah_count`),
    `meta` = JSON_MERGE_PATCH(COALESCE(`meta`, '{}'), VALUES(`meta`)),
    `updated_at` = NOW();
