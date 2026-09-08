import type { ImpactSource } from '../game/DestructionSession';
import type { RuneKind } from '../rune/RuneTypes';

interface MixState {
  flowIntensity: number;
  overdrive: boolean;
}

type AudioBus = 'music' | 'sfx';

export class AudioDirector {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicFilter: BiquadFilterNode | null = null;
  private bassGain: GainNode | null = null;
  private airGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private nextPulseAt = 0;
  private enabled = true;
  private lastOverdrive = false;

  async unlock(): Promise<void> {
    if (!this.enabled || typeof window === 'undefined' || !window.AudioContext) return;
    if (!this.context) this.initialize();
    if (!this.context) return;

    try {
      if (this.context.state === 'suspended') await this.context.resume();
    } catch (error) {
      console.warn('[Rune Ball] Audio unlock failed; continuing silently.', error);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (this.masterGain && this.context) {
      this.masterGain.gain.setTargetAtTime(enabled ? 0.72 : 0.0001, this.context.currentTime, 0.04);
    }
  }

  update(state: MixState): void {
    const context = this.context;
    if (!context || context.state !== 'running' || !this.enabled) return;

    const flow = this.clamp01(state.flowIntensity);
    const overdrive = state.overdrive;
    const now = context.currentTime;

    this.musicFilter?.frequency.setTargetAtTime(
      420 + flow * 820 + (overdrive ? 1150 : 0),
      now,
      0.12,
    );
    this.bassGain?.gain.setTargetAtTime(0.038 + flow * 0.018 + (overdrive ? 0.035 : 0), now, 0.12);
    this.airGain?.gain.setTargetAtTime(0.008 + flow * 0.016 + (overdrive ? 0.025 : 0), now, 0.12);

    if (overdrive !== this.lastOverdrive) {
      this.nextPulseAt = now;
      this.lastOverdrive = overdrive;
    }

    if (now >= this.nextPulseAt) {
      const pulseFrequency = overdrive ? 82.4 : 55 + flow * 18;
      this.playTone(pulseFrequency, pulseFrequency * (overdrive ? 1.015 : 1), overdrive ? 0.11 : 0.075, overdrive ? 0.027 : 0.014, 'sine', 0, 'music');
      this.nextPulseAt = now + (overdrive ? 0.25 : 0.52 - flow * 0.12);
    }
  }

  playRebound(): void {
    this.playTone(145, 280, 0.085, 0.055, 'triangle');
  }

  playImpact(source: ImpactSource, armorBroken: boolean): void {
    const chain = source === 'chain';
    this.playNoise(0.04, chain ? 0.038 : 0.026, chain ? 1800 : 1250, 'highpass');
    this.playTone(
      armorBroken ? 118 : chain ? 210 : 165,
      armorBroken ? 72 : chain ? 145 : 105,
      armorBroken ? 0.09 : 0.065,
      armorBroken ? 0.07 : chain ? 0.058 : 0.042,
      armorBroken ? 'square' : 'triangle',
    );
  }

  playBreak(combo: number, source: ImpactSource, armored: boolean): void {
    this.playNoise(armored ? 0.16 : 0.12, armored ? 0.105 : 0.082, armored ? 900 : 1250, 'highpass');
    this.playTone(armored ? 180 : 240, armored ? 72 : 115, armored ? 0.18 : 0.13, armored ? 0.105 : 0.078, 'triangle');
    if (source === 'chain') this.playTone(360, 690, 0.11, 0.052, 'sine', 0.018);
    if (combo > 0 && combo % 4 === 0) this.playComboMilestone(combo);
  }

  playRune(rune: RuneKind): void {
    switch (rune) {
      case 'vortex':
        this.playTone(520, 145, 0.23, 0.075, 'sine');
        this.playNoise(0.08, 0.028, 520, 'lowpass');
        break;
      case 'split':
        this.playTone(270, 590, 0.18, 0.06, 'triangle');
        this.playTone(350, 760, 0.18, 0.045, 'sine', 0.028);
        break;
      case 'chain':
        this.playTone(245, 510, 0.10, 0.06, 'square');
        this.playTone(340, 720, 0.10, 0.045, 'triangle', 0.065);
        break;
    }
  }

  playRuneFailure(): void {
    this.playTone(120, 92, 0.075, 0.028, 'square');
  }

  playChain(targetCount: number): void {
    const strength = Math.min(1, Math.max(0, targetCount) / 3);
    this.playNoise(0.075, 0.045 + strength * 0.025, 1800, 'highpass');
    this.playTone(320, 840 + strength * 180, 0.18, 0.07 + strength * 0.02, 'sawtooth');
  }

  playOverdriveEnter(): void {
    this.playTone(145, 42, 0.58, 0.22, 'sine');
    this.playNoise(0.20, 0.12, 760, 'lowpass');
    this.playTone(220, 220, 0.46, 0.06, 'sine', 0.15);
    this.playTone(330, 330, 0.42, 0.045, 'triangle', 0.18);
    this.playTone(440, 440, 0.38, 0.035, 'sine', 0.21);
  }

  playOverdriveExit(): void {
    this.playTone(430, 165, 0.34, 0.09, 'triangle');
    this.playTone(110, 68, 0.40, 0.10, 'sine', 0.03);
  }

  playResultSting(): void {
    this.playTone(220, 330, 0.18, 0.055, 'triangle');
    this.playTone(330, 495, 0.24, 0.055, 'triangle', 0.11);
    this.playTone(495, 660, 0.34, 0.05, 'sine', 0.23);
  }

  private initialize(): void {
    try {
      const context = new AudioContext();
      const masterGain = context.createGain();
      const musicGain = context.createGain();
      const sfxGain = context.createGain();
      const musicFilter = context.createBiquadFilter();
      const bassGain = context.createGain();
      const airGain = context.createGain();

      masterGain.gain.value = 0.72;
      musicGain.gain.value = 0.42;
      sfxGain.gain.value = 0.72;
      musicFilter.type = 'lowpass';
      musicFilter.frequency.value = 420;
      musicFilter.Q.value = 0.8;
      bassGain.gain.value = 0.038;
      airGain.gain.value = 0.008;

      musicGain.connect(masterGain);
      sfxGain.connect(masterGain);
      masterGain.connect(context.destination);

      const bass = context.createOscillator();
      bass.type = 'sine';
      bass.frequency.value = 55;
      bass.connect(bassGain);
      bassGain.connect(musicFilter);

      const air = context.createOscillator();
      air.type = 'triangle';
      air.frequency.value = 110;
      air.connect(airGain);
      airGain.connect(musicFilter);
      musicFilter.connect(musicGain);

      bass.start();
      air.start();

      this.context = context;
      this.masterGain = masterGain;
      this.musicGain = musicGain;
      this.sfxGain = sfxGain;
      this.musicFilter = musicFilter;
      this.bassGain = bassGain;
      this.airGain = airGain;
      this.noiseBuffer = this.createNoiseBuffer(context);
      this.nextPulseAt = context.currentTime;
    } catch (error) {
      console.warn('[Rune Ball] Web Audio unavailable; continuing silently.', error);
      this.context = null;
    }
  }

  private playComboMilestone(combo: number): void {
    const base = 470 + Math.min(12, combo) * 10;
    this.playTone(base, base * 1.04, 0.12, 0.045, 'sine');
    this.playTone(base * 1.5, base * 1.52, 0.16, 0.032, 'triangle', 0.045);
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
