/**
 * Audio synthesis & Voice Note utility for Between Us
 * Uses Web Audio API for zero external dependency procedural audio
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play a realistic gentle heartbeat sound
export function playHeartbeatSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // First beat (lub)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(65, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.12);

    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    // Second beat (dub)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(80, now + 0.14);
    osc2.frequency.exponentialRampToValueAtTime(45, now + 0.28);

    gain2.gain.setValueAtTime(0.35, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.14);
    osc2.stop(now + 0.28);
  } catch (e) {
    console.warn("Audio play prevented", e);
  }
}

// Play sweet crystalline starlight chime
export function playChimeSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now + i * 0.08);

      gain.gain.setValueAtTime(0.18, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.6);
    });
  } catch (e) {
    console.warn("Chime failed", e);
  }
}

// Procedural Lo-Fi Cafe & Rain sound generator
let cafeNoiseNode: AudioNode | null = null;
let cafeGainNode: GainNode | null = null;

export function toggleCafeAmbiance(enable: boolean, volume = 0.15) {
  try {
    const ctx = getAudioContext();
    if (!enable) {
      if (cafeGainNode) {
        cafeGainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      }
      return;
    }

    if (cafeNoiseNode && cafeGainNode) {
      cafeGainNode.gain.setTargetAtTime(volume, ctx.currentTime, 0.5);
      return;
    }

    // Generate brown noise for rain/cozy cafe warmth
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to soft muffled rain / cafe sound
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    cafeGainNode = ctx.createGain();
    cafeGainNode.gain.setValueAtTime(volume, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(cafeGainNode);
    cafeGainNode.connect(ctx.destination);

    whiteNoise.start();
    cafeNoiseNode = whiteNoise;
  } catch (e) {
    console.warn("Ambient audio failed", e);
  }
}

// Voice Note recorder with MediaRecorder
export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async start(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  stop(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No active recording"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);

        // Stop all audio tracks
        this.mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
        this.mediaRecorder = null;
      };

      this.mediaRecorder.stop();
    });
  }
}
