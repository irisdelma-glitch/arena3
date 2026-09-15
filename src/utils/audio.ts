// Audio synthesizer using Web Audio API and SpeechSynthesis for Accessibility

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playHitSound(volume = 0.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.18); // C6

    gain.gain.setValueAtTime(0.25 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Graceful fallback
  }
}

export function playDamageSound(volume = 0.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.28);

    gain.gain.setValueAtTime(0.35 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Graceful fallback
  }
}

export function playShieldBreakSound(volume = 0.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.3 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // Graceful fallback
  }
}

export function playPowerupSound(volume = 0.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(659, ctx.currentTime + 0.12);
    osc.frequency.linearRampToValueAtTime(1318, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.3 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  } catch {
    // Graceful fallback
  }
}

export function playLaserScanSound(volume = 0.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.2 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Graceful fallback
  }
}

export function playTickSound(volume = 0.3) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);

    gain.gain.setValueAtTime(0.15 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Graceful fallback
  }
}

export function playRespawnSound(volume = 0.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
    osc.frequency.linearRampToValueAtTime(523.25, ctx.currentTime + 0.15); // C5
    osc.frequency.linearRampToValueAtTime(1046.5, ctx.currentTime + 0.35); // C6

    gain.gain.setValueAtTime(0.3 * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // Graceful fallback
  }
}

export function playVictoryFanfare(volume = 0.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.15 }, // G5
      { f: 1046.5, d: 0.4 },  // C6
      { f: 880.0, d: 0.15 },  // A5
      { f: 1046.5, d: 0.6 },  // C6
    ];

    let time = ctx.currentTime + 0.05;
    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, time);

      gain.gain.setValueAtTime(0.18 * volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + note.d);

      time += note.d + 0.04;
    });
  } catch {
    // Graceful fallback
  }
}

export function speakTacticalVoice(
  text: string,
  options?: {
    pitch?: number;
    rate?: number;
    onEnd?: () => void;
  }
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (options?.onEnd) options.onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = options?.rate ?? 1.05;
    utterance.pitch = options?.pitch ?? 1.0;

    if (options?.onEnd) {
      utterance.onend = () => options.onEnd?.();
      utterance.onerror = () => options.onEnd?.();
    }

    // Attempt to pick a Brazilian voice if available
    const voices = window.speechSynthesis.getVoices();
    const brVoice = voices.find(
      (v) => v.lang.includes('pt-BR') || v.lang.includes('pt_BR') || v.name.toLowerCase().includes('brazil')
    );
    if (brVoice) {
      utterance.voice = brVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    if (options?.onEnd) options.onEnd();
  }
}

export function cancelVoice() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}
