// Sound Service for Hasana Notification Chimes
// Plays soothing Islamic chime audio with Web Audio API synthesizer fallback.

let audioInstance = null;

/**
 * Play soothing notification chime
 */
export const playNotificationSound = () => {
    try {
        if (typeof window === 'undefined') return;

        // Try playing via HTML5 Audio element
        if (!audioInstance) {
            audioInstance = new Audio('/sounds/notification-soothing.wav');
            audioInstance.volume = 0.85;
        } else {
            audioInstance.currentTime = 0;
        }

        const playPromise = audioInstance.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay policy or audio load failed -> fallback to Web Audio API harmonic chime synthesizer
                playSynthesizedSoothingChime();
            });
        }
    } catch {
        playSynthesizedSoothingChime();
    }
};

/**
 * Pure Web Audio synthesizer fallback for a warm, soothing Tibetan/Islamic meditation bell chord:
 * E5 (659.25Hz), G#5 (830.61Hz), B5 (987.77Hz), E6 (1318.5Hz) with gentle envelope decay.
 */
export const playSynthesizedSoothingChime = () => {
    try {
        if (typeof window === 'undefined') return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const now = ctx.currentTime;
        // Warm harmonic chord
        const notes = [
            { freq: 659.25, gain: 0.16, decay: 1.8 },
            { freq: 830.61, gain: 0.13, decay: 1.9 },
            { freq: 987.77, gain: 0.10, decay: 2.1 },
            { freq: 1318.51, gain: 0.06, decay: 1.5 },
        ];

        const masterGain = ctx.createGain();
        masterGain.connect(ctx.destination);

        notes.forEach(({ freq, gain: targetGain, decay }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // Smooth 25ms attack to avoid clicking
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(targetGain, now + 0.025);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(now);
            osc.stop(now + decay);
        });
    } catch {
        // ignore audio errors
    }
};
