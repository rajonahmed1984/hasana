/**
 * Calendar helpers for the home screen date strip:
 *  - Bangla (বঙ্গাব্দ) date using the Bangladesh revised calendar (2019 onward):
 *    1 Boishakh = 14 April, Boishakh–Ashwin have 31 days, Kartik–Choitro 30,
 *    and Falgun 29 (30 when the Gregorian year it falls in is a leap year).
 *  - Hijri fallback via Intl (Umm al-Qura) for when the backend date has not loaded.
 */

export const BANGLA_MONTHS = [
    'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
    'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র',
];

// Two months per season, starting with Boishakh
export const BANGLA_SEASONS = ['গ্রীষ্ম', 'বর্ষা', 'শরৎ', 'হেমন্ত', 'শীত', 'বসন্ত'];

export const HIJRI_MONTHS_BN = [
    'মুহাররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জমাদিউল আউয়াল', 'জমাদিউস সানি',
    'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ',
];

const DAY_MS = 86400000;
const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

export function getBanglaDate(date = new Date()) {
    const y = date.getFullYear();
    // Work in UTC midnights so DST never shifts the day count
    const today = Date.UTC(y, date.getMonth(), date.getDate());
    const startYear = today >= Date.UTC(y, 3, 14) ? y : y - 1;
    let offset = Math.round((today - Date.UTC(startYear, 3, 14)) / DAY_MS);

    // Falgun falls in February of the following Gregorian year
    const lengths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, isLeap(startYear + 1) ? 30 : 29, 30];
    let month = 0;
    while (month < 11 && offset >= lengths[month]) {
        offset -= lengths[month];
        month++;
    }

    return {
        day: offset + 1,
        month,
        monthName: BANGLA_MONTHS[month],
        year: startYear - 593,
        season: BANGLA_SEASONS[Math.floor(month / 2)],
    };
}

export function getHijriFallback(date = new Date()) {
    try {
        const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
            day: 'numeric', month: 'numeric', year: 'numeric',
        }).formatToParts(date);
        const get = (type) => parseInt(parts.find((p) => p.type === type)?.value, 10);
        const day = get('day');
        const month = get('month');
        const year = get('year');
        if (!day || !month || !year) return null;
        return { day, month, year, month_bn: HIJRI_MONTHS_BN[month - 1] };
    } catch {
        return null;
    }
}
