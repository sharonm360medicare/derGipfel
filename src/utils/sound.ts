/**
 * Web Audio API synthesized sound effects for DER GIPFEL
 * Zero-dependency, reliable in all browser sandboxes.
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundMuted(muted: boolean) {
  isMuted = muted;
}

export function getSoundMuted(): boolean {
  return isMuted;
}

/**
 * Play a victorious, multi-harmonic celebration fanfare
 */
export function playCelebrationFanfare() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [
    { freq: 440.0, time: 0.0, dur: 0.18 }, // A4
    { freq: 554.37, time: 0.18, dur: 0.18 }, // C#5
    { freq: 659.25, time: 0.36, dur: 0.22 }, // E5
    { freq: 880.0, time: 0.58, dur: 0.65 }, // A5 (high peak)
  ];

  const now = ctx.currentTime;

  notes.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.freq, now + note.time);

    gain.gain.setValueAtTime(0.001, now + note.time);
    gain.gain.exponentialRampToValueAtTime(0.3, now + note.time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + note.time);
    osc.stop(now + note.time + note.dur + 0.05);
  });
}

/**
 * Play a joyful uplifting chime for correct quiz answers
 */
export function playCorrectSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [
    { freq: 523.25, time: 0.0, dur: 0.12 }, // C5
    { freq: 659.25, time: 0.09, dur: 0.14 }, // E5
    { freq: 783.99, time: 0.18, dur: 0.28 }, // G5
  ];

  notes.forEach((n) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(n.freq, now + n.time);

    gain.gain.setValueAtTime(0.15, now + n.time);
    gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + n.time);
    osc.stop(now + n.time + n.dur + 0.02);
  });
}

/**
 * Play a soft, gentle error buzz for incorrect answers
 */
export function playIncorrectSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, now); // A3
  osc.frequency.exponentialRampToValueAtTime(164.81, now + 0.25); // E3

  gain.gain.setValueAtTime(0.14, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.32);
}

/**
 * Play a crisp herald chime for exam start
 */
export function playExamStartSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.42);
}

/**
 * Soft tick sound for the final 10 seconds of exam
 */
export function playTimerTick() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(987.77, now); // B5
  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

/**
 * Play gentle click sound for navigation and interactions
 */
export function playClickSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}
