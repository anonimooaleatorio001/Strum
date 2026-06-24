// A tiny Web-Audio synth used by the Chord library and the lessons to play
// plucked notes / strummed chords. Everything runs through one shared context.

let ctx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Pluck a single string-like note with a quick attack and natural decay. */
export function playNote(
  midi: number,
  startAt: number,
  duration = 1.6,
  gainValue = 0.13
): void {
  const ac = getAudioContext();
  const freq = midiToFreq(midi);

  const osc = ac.createOscillator();
  const osc2 = ac.createOscillator();
  osc.type = "triangle";
  osc2.type = "sawtooth";
  osc.frequency.value = freq;
  osc2.frequency.value = freq;
  osc2.detune.value = 5;

  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2600, startAt);
  filter.frequency.exponentialRampToValueAtTime(800, startAt + duration);

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.linearRampToValueAtTime(gainValue, startAt + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(filter);
  filter.connect(ac.destination);

  osc.start(startAt);
  osc2.start(startAt);
  osc.stop(startAt + duration);
  osc2.stop(startAt + duration);
}

/** Strum an array of MIDI notes (low → high). `null` entries are muted strings. */
export function strumChord(notes: (number | null)[], down = true): void {
  const ac = getAudioContext();
  const start = ac.currentTime + 0.03;
  const sounded = notes.filter((n): n is number => n !== null);
  const ordered = down ? sounded : [...sounded].reverse();
  ordered.forEach((n, i) => playNote(n, start + i * 0.04, 1.8, 0.11));
}

/** A short click used by the metronome. Higher pitch on the down-beat. */
export function playClick(accent: boolean, startAt?: number): void {
  const ac = getAudioContext();
  const t = startAt ?? ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.frequency.value = accent ? 1600 : 1000;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(accent ? 0.5 : 0.32, t + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.06);
}
