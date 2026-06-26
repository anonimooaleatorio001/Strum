// Microphone pitch tracking (client only).
//
// Wraps getUserMedia + an AnalyserNode + the ACF2+ detector into a small
// controller the lesson player and ear-trainer can start/stop. It reports a
// smoothed live pitch via a callback on every animation frame.

import { getAudioContext } from "./audio";
import { autoCorrelate, noteFromPitch, centsOffFromPitch } from "./pitch";

export interface LivePitch {
  /** Detected frequency in Hz, or -1 when nothing pitched is heard. */
  freq: number;
  /** Nearest MIDI note (rounded), or -1. */
  midi: number;
  /** Cents away from that note. */
  cents: number;
  /** Audio-context time of the reading. */
  time: number;
}

export interface PitchTracker {
  stop: () => void;
  /** Live audio-context clock so callers can schedule against the same time. */
  context: AudioContext;
}

export interface TrackerOptions {
  onPitch: (p: LivePitch) => void;
  onError?: (e: unknown) => void;
}

/**
 * Begin tracking microphone pitch. Resolves once the mic is live; rejects if
 * permission is denied. Call `stop()` to release the mic and stop the loop.
 */
export async function startPitchTracker(
  opts: TrackerOptions
): Promise<PitchTracker> {
  const ctx = getAudioContext();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
  });

  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);

  const buf = new Float32Array(analyser.fftSize) as Float32Array<ArrayBuffer>;
  let raf = 0;
  let stopped = false;

  const loop = () => {
    if (stopped) return;
    analyser.getFloatTimeDomainData(buf);
    const freq = autoCorrelate(buf, ctx.sampleRate);
    if (freq > 0) {
      const midi = noteFromPitch(freq);
      const cents = centsOffFromPitch(freq, midi);
      opts.onPitch({ freq, midi, cents, time: ctx.currentTime });
    } else {
      opts.onPitch({ freq: -1, midi: -1, cents: 0, time: ctx.currentTime });
    }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return {
    context: ctx,
    stop() {
      stopped = true;
      cancelAnimationFrame(raf);
      source.disconnect();
      stream.getTracks().forEach((t) => t.stop());
    },
  };
}
