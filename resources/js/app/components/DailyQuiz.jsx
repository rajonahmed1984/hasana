import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CircleHelp, Check, X, ChevronRight, Flame, RotateCcw, Loader2 } from 'lucide-react';
import { hapticImpact } from '../native';

const pad = (n) => String(n).padStart(2, '0');
const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const STREAK_KEY = 'hasana-quiz-streak';

const readJson = (key, fallback) => {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
};
const writeJson = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // ignore
    }
};

// Small daily quiz built from the app's data (today's ayah, a hadith and a dua)
export function DailyQuiz() {
    const today = dateKey(new Date());
    const answersKey = `hasana-quiz-${today}`;
    const [questions, setQuestions] = useState(null);
    const [failed, setFailed] = useState(false);
    const [answers, setAnswers] = useState(() => readJson(answersKey, []));
    const [current, setCurrent] = useState(() => Math.min(readJson(answersKey, []).length, 99));
    const [streak, setStreak] = useState(() => readJson(STREAK_KEY, { last: null, count: 0 }));

    useEffect(() => {
        fetch(`/api/quiz?date=${today}`, { headers: { Accept: 'application/json' } })
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((json) => setQuestions(json.questions || []))
            .catch(() => setFailed(true));
    }, [today]);

    if (failed) return null;

    if (!questions) {
        return (
            <div className="rounded-3xl bg-card border border-border p-6 shadow-md flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" /> আজকের কুইজ লোড হচ্ছে...
            </div>
        );
    }
    if (!questions.length) return null;

    const done = answers.length >= questions.length;
    const score = answers.filter((a, i) => a === questions[i]?.answer).length;
    const index = Math.min(current, questions.length - 1);
    const q = questions[index];
    const chosen = answers[index];
    const answered = chosen !== undefined;

    const choose = (option) => {
        if (answered) return;
        hapticImpact();
        const next = [...answers];
        next[index] = option;
        setAnswers(next);
        writeJson(answersKey, next);

        if (next.length >= questions.length && streak.last !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const updated = { last: today, count: streak.last === dateKey(yesterday) ? streak.count + 1 : 1 };
            setStreak(updated);
            writeJson(STREAK_KEY, updated);
        }
    };

    const showResult = done && current >= questions.length;

    return (
        <div className="rounded-3xl bg-card border border-gold/30 p-5 md:p-7 shadow-md">
            <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-bold">
                    <CircleHelp className="w-3.5 h-3.5 text-gold" /> আজকের কুইজ
                </span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {streak.count > 0 && (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-600" title="টানা যত দিন কুইজ শেষ করেছেন">
                            <Flame className="w-3.5 h-3.5" /> {streak.count} দিন
                        </span>
                    )}
                    {!showResult && <span>{index + 1}/{questions.length}</span>}
                </div>
            </div>

            {showResult ? (
                <div className="text-center py-4">
                    <p className="text-3xl font-bold text-primary">{score}/{questions.length}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {score === questions.length ? 'মাশাআল্লাহ! সবগুলো সঠিক হয়েছে।' : 'ভালো চেষ্টা! উত্তরগুলো দেখে নিন, আগামীকাল নতুন কুইজ আসবে।'}
                    </p>
                    <button
                        type="button"
                        onClick={() => setCurrent(0)}
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted text-sm font-semibold hover:bg-primary/10 hover:text-primary transition native-press"
                    >
                        <RotateCcw className="w-4 h-4" /> উত্তরগুলো দেখুন
                    </button>
                </div>
            ) : (
                <>
                    <h3 className="font-bold text-base md:text-lg">{q.question}</h3>
                    {q.text && (
                        <p className="mt-3 text-sm md:text-base leading-relaxed bg-muted/60 rounded-2xl px-4 py-3 border border-border/60">
                            {q.text}
                        </p>
                    )}

                    <div className="mt-4 grid gap-2">
                        {q.options.map((opt, i) => {
                            const isCorrect = i === q.answer;
                            const isChosen = i === chosen;
                            let style = 'bg-muted/50 border-border hover:bg-primary/10 hover:border-primary/40';
                            if (answered && isCorrect) style = 'bg-green-500/15 border-green-600 text-green-800 dark:text-green-300';
                            else if (answered && isChosen) style = 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-300';
                            else if (answered) style = 'bg-muted/30 border-border opacity-70';
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={answered}
                                    onClick={() => choose(i)}
                                    className={`flex items-center justify-between gap-2 text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition native-press ${style}`}
                                >
                                    <span>{opt}</span>
                                    {answered && isCorrect && <Check className="w-4 h-4 shrink-0" />}
                                    {answered && isChosen && !isCorrect && <X className="w-4 h-4 shrink-0" />}
                                </button>
                            );
                        })}
                    </div>

                    {answered && (
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-xs text-muted-foreground">
                                {q.explanation}
                                {q.link && (
                                    <Link to={q.link} className="ml-1.5 inline-flex items-center text-primary font-semibold hover:underline">
                                        পড়ুন <ChevronRight className="w-3 h-3" />
                                    </Link>
                                )}
                            </p>
                            <button
                                type="button"
                                onClick={() => { hapticImpact(); setCurrent(index + 1); }}
                                className="ml-auto px-4 py-2 rounded-full gold-gradient-btn text-primary text-xs font-bold native-press"
                            >
                                {index + 1 < questions.length ? 'পরের প্রশ্ন' : 'ফলাফল দেখুন'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
