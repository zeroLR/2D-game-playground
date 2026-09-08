import type { ImpactSource } from '../game/DestructionSession';
import type { RuneKind } from '../rune/RuneTypes';

interface MixState {
  flowIntensity: number;
  overdrive: boolean;
}

type AudioBus = 'music' | 'sfx';
type AudioContextConstructor = new () => AudioContext;

export interface AudioDebugState {
  supported: boolean;
  enabled: boolean;
  initialized: boolean;
  state: AudioContextState | 'uninitialized' | 'unavailable';
}

export class AudioDirector {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicFilter: BiquadFilterNode | null = null;
  private bassGain: GainNode | null = null;
  private harmonyGain: GainNode | null = null;
  private airGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private nextPulseAt = 0;
  private enabled = true;
  private lastOverdrive = false;
  private unlockReported = false;
  private unlockCuePlayed = false;

  get debugState(): AudioDebugState {
    const supported = this.getAudioContextConstructor() !== null;
    return {
      supported,
      enabled: this.enabled,
      initialized: this.context !== null,
      state: this.context?.state ?? (supported ? 'uninitialized' : 'unavailable'),
    };
  }

  async unlock(): Promise<boolean> {
    if (!this.enabled) return false;
    if (!this.context) this.initialize();
    const context = this.context;
    if (!context) return false;

    try {
      // Safari/iOS has historically been stricter about Web Audio activation.
      // Prime a one-sample source synchronously inside the user gesture before resume().
      this.primeContext(context);
      if (context.state === 'suspended') await context.resume();

      const running = context.state === 'running';
      if (running && !this.unlockCuePlayed) {
        this.unlockCuePlayed = true;
        this.playTone(330, 440, 0.10, 0.035, 'sine');
      }
      if (!this.unlockReported) {
        this.unlockReported = true;
        console.info('[Rune Ball] Audio unlock state.', this.debugState);
      }
      if (!running) console.warn('[Rune Ball] AudioContext did not enter running state.', this.debugState);
      return running;
    } catch (error) {
      console.warn('[Rune Ball] Audio unlock failed; continuing silently.', error, this.debugState);
      return false;
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (this.masterGain && this.context) {
      this.masterGain.gain.setTargetAtTime(enabled ? 0.90 : 0.0001, this.context.currentTime, 0.04);
    }
  }

  update(state: MixState): void {
    const context = this.context;
    if (!context || context.state !== 'running' || !this.enabled) return;

    const flow = this.clamp01(state.flowIntensity);
    const overdrive = state.overdrive;
    const now = context.currentTime;

    this.musicFilter?.frequency.setTargetAtTime(
      520 + flow * 980 + (overdrive ? 1350 : 0),
      now,
      0.12,
    );
    this.bassGain?.gain.setTargetAtTime(0.060 + flow * 0.024 + (overdrive ? 0.038 : 0), now, 0.12);
    this.harmonyGain?.gain.setTargetAtTime(0.020 + flow * 0.022 + (overdrive ? 0.030 : 0), now, 0.12);
    this.airGain?.gain.setTargetAtTime(0.010 + flow * 0.015 + (overdrive ? 0.020 : 0), now, 0.12);

    if (overdrive !== this.lastOverdrive) {
      this.nextPulseAt = now;
      this.lastOverdrive = overdrive;
    }

    if (now >= this.nextPulseAt) {
      const root = overdrive ? 82.4 : 62 + flow * 18;
      this.playTone(root * 2, root * 2.02, overdrive ? 0.16 : 0.11, overdrive ? 0.052 : 0.026, 'triangle', 0, 'music');
      if (overdrive) this.playTone(root * 3, root * 3.03, 0.13, 0.028, 'sine', 0.04, 'music');
      this.nextPulseAt = now + (overdrive ? 0.28 : 0.58 - flow * 0.14);
    }
  }

  playRebound(): void {
    this.playTone(145, 300, 0.09, 0.075, 'triangle');
  }

  playImpact(source: ImpactSource, armorBroken: boolean): void {
    const chain = source === 'chain';
    this.playNoise(0.045, chain ? 0.055 : 0.038, chain ? 1800 : 1250, 'highpass');
    this.playTone(
      armorBroken ? 118 : chain ? 210 : 165,
      armorBroken ? 72 : chain ? 145 : 105,
      armorBroken ? 0.10 : 0.07,
      armorBroken ? 0.095 : chain ? 0.078 : 0.060,
      armorBroken ? 'square' : 'triangle',
    );
  }

  playBreak(combo: number, source: ImpactSource, armored: boolean): void {
    this.playNoise(armored ? 0.17 : 0.13, armored ? 0.13 : 0.105, armored ? 900 : 1250, 'highpass');
    this.playTone(armored ? 180 : 240, armored ? 72 : 115, armored ? 0.19 : 0.14, armored ? 0.14 : 0.105, 'triangle');
    if (source === 'chain') this.playTone(360, 690, 0.12, 0.070, 'sine', 0.018);
    if (combo > 0 && combo % 4 === 0) this.playComboMilestone(combo);
  }

  playRune(rune: RuneKind): void {
    switch (rune) {
      case 'vortex':
        this.playTone(540, 135, 0.24, 0.105, 'sine');
        this.playNoise(0.09, 0.045, 520, 'lowpass');
        break;
      case 'split':
        this.playTone(270, 620, 0.19, 0.090, 'triangle');
        this.playTone(350, 790, 0.19, 0.065, 'sine', 0.028);
        break;
      case 'chain':
        this.playTone(245, 530, 0.11, 0.090, 'square');
        this.playTone(340, 760, 0.11, 0.065, 'triangle', 0.065);
        break;
    }
  }

  playRuneFailure(): void {
    this.playTone(120, 92, 0.08, 0.042, 'square');
  }

  playChain(targetCount: number): void {
    const strength = Math.min(1, Math.max(0, targetCount) / 3);
    this.playNoise(0.085, 0.070 + strength * 0.030, 1800, 'highpass');
    this.playTone(320, 840 + strength * 180, 0.19, 0.10 + strength * 0.025, 'sawtooth');
  }

  playOverdriveEnter(): void {
    this.playTone(150, 42, 0.62, 0.26, 'sine');
    this.playNoise(0.22, 0.16, 760, 'lowpass');
    this.playTone(220, 220, 0.48, 0.080, 'sine', 0.15);
    this.playTone(330, 330, 0.44, 0.065, 'triangle', 0.18);
    this.playTone(440, 440, 0.40, 0.050, 'sine', 0.21);
  }

  playOverdriveExit(): void {
    this.playTone(430, 165, 0.36, 0.12, 'triangle');
    this.playTone(110, 68, 0.42, 0.13, 'sine', 0.03);
  }

  playResultSting(): void {
    this.playTone(220, 330, 0.18, 0.075, 'triangle');
    this.playTone(330, 495, 0.24, 0.075, 'triangle', 0.11);
    this.playTone(495, 660, 0.34, 0.065, 'sine', 0.23);
  }

  private initialize(): void {
    try {
      const AudioContextCtor = this.getAudioContextConstructor();
      if (!AudioContextCtor) {
        console.warn('[Rune Ball] Web Audio unavailable; continuing silently.');
        return;
      }

      const context = new AudioContextCtor();
      const masterGain = context.createGain();
      const musicGain = context.createGain();
      const sfxGain = context.createGain();
      const musicFilter = context.createBiquadFilter();
      const bassGain = context.createGain();
      const harmonyGain = context.createGain();
      const airGain = context.createGain();

      masterGain.gain.value = 0.90;
      musicGain.gain.value = 0.62;
      sfxGain.gain.value = 0.90;
      musicFilter.type = 'lowpass';
      musicFilter.frequency.value = 520;
      musicFilter.Q.value = 0.8;
      bassGain.gain.value = 0.060;
      harmonyGain.gain.value = 0.020;
      airGain.gain.value = 0.010;

      musicGain.connect(masterGain);
      sfxGain.connect(masterGain);
      masterGain.connect(context.destination);

      const bass = context.createOscillator();
      bass.type = 'sine';
      bass.frequency.value = 55;
      bass.connect(bassGain);
      bassGain.connect(musicFilter);

      const harmony = context.createOscillator();
      harmony.type = 'triangle';
      harmony.frequency.value = 82.5;
      harmony.connect(harmonyGain);
      harmonyGain.connect(musicFilter);

      const air = context.createOscillator();
      air.type = 'sine';
      air.frequency.value = 165;
      air.connect(airGain);
      airGain.connect(musicFilter);
      musicFilter.connect(musicGain);

      bass.start();
      harmony.start();
      air.start();

      this.context = context;
      this.masterGain = masterGain;
      this.musicGain = musicGain;
      this.sfxGain = sfxGain;
      this.musicFilter = musicFilter;
      this.bassGain = bassGain;
      this.harmonyGain = harmonyGain;
      this.airGain = airGain;
      this.noiseBuffer = this.createNoiseBuffer(context);
      this.nextPulseAt = context.currentTime;
    } catch (error) {
      console.warn('[Rune Ball] Web Audio unavailable; continuing silently.', error);
      this.context = null;
    }
  }

  private getAudioContextConstructor(): AudioContextConstructor | null {
    if (typeof window === 'undefined') return null;
    const audioWindow = window as typeof window & { webkitAudioContext?: AudioContextConstructor };
    return audioWindow.AudioContext ?? audioWindow.webkitAudioContext ?? null;
  }

  private primeContext(context: AudioContext): void {
    try {
      const buffer = context.createBuffer(1, 1, 22050);
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
    } catch (error) {
      console.debug('[Rune Ball] Audio prime skipped.', error);
    }
  }

  private playComboMilestone(combo: number): void {
    const base = 470 + Math.min(12, combo) * 10;
    this.playTone(base, base * 1.04, 0.13, 0.065, 'sine');
    this.playTone(base * 1.5, base * 1.52, 0.17, 0.048, 'triangle', 0.045);
  }

  private playTone(
    startFrequency: number,
    endFrequency: number,
    duration: number,
    peakGain: number,
    type: OscillatorType,
    delay = 0,
    bus: AudioBus = 'sfx',
  ): void {
    const context = this.context;
    const destination = bus === 'music' ? this.musicGain : this.sfxGain;
    if (!context || context.state !== 'running' || !destination || !this.enabled) return;

    const startAt = context.currentTime + Math.max(0, delay);
    const endAt = startAt + Math.max(0.02, duration);
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(Math.max(20, startFrequency), startAt);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), endAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peakGain), startAt + Math.min(0.012, duration * 0.2));
    gain.gain.exponentialRampToValueAtTime(0.0001, endAt);
    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(startAt);
    oscillator.stop(endAt + 0.02);
  }

  private playNoise(duration: number, peakGain: number, frequency: number, filterType: BiquadFilterType): void {
    const context = this.context;
    if (!context || context.state !== 'running' || !this.sfxGain || !this.noiseBuffer || !this.enabled) return;

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    const now = context.currentTime;
    const endAt = now + Math.max(0.02, duration);
    source.buffer = this.noiseBuffer;
    filter.type = filterType;
    filter.frequency.value = Math.max(80, frequency);
    filter.Q.value = 0.7;
    gain.gain.setValueAtTime(Math.max(0.0002, peakGain), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, endAt);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    source.start(now);
    source.stop(endAt);
  }

  private createNoiseBuffer(context: AudioContext): AudioBuffer {
    const sampleCount = Math.floor(context.sampleRate * 0.25);
    const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
    const channel = buffer.getChannelData(0);
    let seed = 0x51f15e;
    for (let index = 0; index < sampleCount; index += 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      channel[index] = (seed / 0xffffffff) * 2 - 1;
    }
    return buffer;
  }

  private clamp01(value: number): number {
    return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
  }
}
