import type { ImpactSource } from '../game/DestructionSession';
import type { RuneKind } from '../rune/RuneTypes';

interface MixState {
  flowIntensity: number;
  overdrive: boolean;
}

type AudioFormat = 'ogg' | 'mp3';
type AudioRuntimeState = 'uninitialized' | 'locked' | 'playing' | 'partial' | 'failed' | 'unavailable';
type SfxStem =
  | 'brick-hit'
  | 'brick-armored'
  | 'brick-break'
  | 'wall-hit'
  | 'heartbeat'
  | 'laser'
  | 'powerup-get'
  | 'level-complete';

export interface AudioDebugState {
  supported: boolean;
  enabled: boolean;
  initialized: boolean;
  state: AudioRuntimeState;
  format: AudioFormat | null;
}

class HtmlAudioPool {
  private readonly voices: HTMLAudioElement[];
  private cursor = 0;

  constructor(url: string, voiceCount = 2) {
    this.voices = Array.from({ length: voiceCount }, () => {
      const voice = document.createElement('audio');
      voice.src = url;
      voice.preload = 'auto';
      return voice;
    });
  }

  prime(): Promise<boolean[]> {
    return Promise.all(this.voices.map(async (voice) => {
      const previousMuted = voice.muted;
      const previousVolume = voice.volume;
      try {
        voice.muted = true;
        voice.volume = 0;
        const started = voice.play();
        await started;
        voice.pause();
        this.reset(voice);
        return true;
      } catch {
        return false;
      } finally {
        voice.muted = previousMuted;
        voice.volume = previousVolume;
      }
    }));
  }

  play(volume: number, playbackRate = 1): void {
    const voice = this.acquire();
    voice.muted = false;
    voice.volume = clamp01(volume);
    voice.playbackRate = Math.min(1.6, Math.max(0.55, playbackRate));
    this.reset(voice);
    void voice.play().catch((error: unknown) => {
      console.debug('[Rune Ball] SFX playback skipped.', error);
    });
  }

  pauseAll(): void {
    for (const voice of this.voices) voice.pause();
  }

  private acquire(): HTMLAudioElement {
    const available = this.voices.find((voice) => voice.paused || voice.ended);
    if (available) return available;
    const voice = this.voices[this.cursor];
    this.cursor = (this.cursor + 1) % this.voices.length;
    return voice;
  }

  private reset(voice: HTMLAudioElement): void {
    try {
      voice.currentTime = 0;
    } catch {
      // Some mobile browsers reject currentTime changes before metadata is ready.
    }
  }
}

export class AudioDirector {
  private enabled = true;
  private initialized = false;
  private runtimeState: AudioRuntimeState = 'uninitialized';
  private format: AudioFormat | null = null;
  private bgm: HTMLAudioElement | null = null;
  private readonly pools = new Map<SfxStem, HtmlAudioPool>();
  private unlockPromise: Promise<boolean> | null = null;
  private flowIntensity = 0;
  private overdrive = false;

  get debugState(): AudioDebugState {
    const supported = this.supported;
    return {
      supported,
      enabled: this.enabled,
      initialized: this.initialized,
      state: supported ? this.runtimeState : 'unavailable',
      format: this.format,
    };
  }

  async unlock(): Promise<boolean> {
    if (!this.enabled || !this.supported) return false;
    if (!this.initialized) this.initialize();
    if (!this.bgm) return false;
    if (this.runtimeState === 'playing' && !this.bgm.paused) return true;
    if (this.unlockPromise) return this.unlockPromise;

    // Important: performUnlock invokes HTMLMediaElement.play() synchronously before
    // its first await so this call remains inside the browser's user-activation chain.
    this.unlockPromise = this.performUnlock().finally(() => {
      this.unlockPromise = null;
    });
    return this.unlockPromise;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.bgm?.pause();
      for (const pool of this.pools.values()) pool.pauseAll();
      return;
    }

    if (this.runtimeState === 'playing' && this.bgm) {
      void this.bgm.play().catch(() => {
        this.runtimeState = 'locked';
      });
    }
  }

  update(state: MixState): void {
    this.flowIntensity = clamp01(state.flowIntensity);
    this.overdrive = state.overdrive;
    if (!this.bgm || this.runtimeState !== 'playing') return;

    const targetVolume = this.overdrive
      ? 0.50
      : 0.36 + this.flowIntensity * 0.08;
    this.bgm.volume += (targetVolume - this.bgm.volume) * 0.08;
  }

  playRebound(): void {
    this.playSfx('wall-hit', 0.46, 1.10);
  }

  playImpact(source: ImpactSource, armorBroken: boolean): void {
    if (armorBroken) {
      this.playSfx('brick-armored', 0.58, 0.92);
      return;
    }
    if (source === 'chain') {
      this.playSfx('laser', 0.40, 0.82);
      return;
    }
    this.playSfx('brick-hit', 0.42, 1.04);
  }

  playBreak(combo: number, source: ImpactSource, armored: boolean): void {
    this.playSfx('brick-break', armored ? 0.86 : 0.72, armored ? 0.84 : 1);
    if (source === 'chain') this.playSfx('laser', 0.46, 1.12);
    if (combo > 0 && combo % 4 === 0) {
      this.playSfx('powerup-get', 0.44, 1 + Math.min(0.28, combo * 0.012));
    }
  }

  playRune(rune: RuneKind): void {
    switch (rune) {
      case 'vortex':
        this.playSfx('heartbeat', 0.62, 0.72);
        this.playSfx('powerup-get', 0.28, 0.72);
        break;
      case 'split':
        this.playSfx('laser', 0.62, 1.22);
        break;
      case 'chain':
        this.playSfx('powerup-get', 0.64, 0.94);
        this.playSfx('laser', 0.34, 0.76);
        break;
    }
  }

  playRuneFailure(): void {
    this.playSfx('brick-armored', 0.24, 0.72);
  }

  playChain(targetCount: number): void {
    const strength = clamp01(targetCount / 3);
    this.playSfx('laser', 0.58 + strength * 0.16, 0.90 + strength * 0.14);
    this.playSfx('powerup-get', 0.38 + strength * 0.12, 1.04 + strength * 0.10);
  }

  playOverdriveEnter(): void {
    this.playSfx('brick-break', 0.92, 0.72);
    this.playSfx('powerup-get', 0.88, 0.78);
    this.playSfx('heartbeat', 0.54, 0.64);
  }

  playOverdriveExit(): void {
    this.playSfx('wall-hit', 0.48, 0.68);
    this.playSfx('powerup-get', 0.38, 0.70);
  }

  playResultSting(): void {
    this.playSfx('level-complete', 0.70, 0.94);
  }

  private get supported(): boolean {
    return typeof document !== 'undefined' && typeof document.createElement === 'function';
  }

  private initialize(): void {
    if (!this.supported) {
      this.runtimeState = 'unavailable';
      return;
    }

    try {
      const probe = document.createElement('audio');
      const oggSupport = probe.canPlayType('audio/ogg; codecs="vorbis"');
      this.format = oggSupport === 'probably' || oggSupport === 'maybe' ? 'ogg' : 'mp3';

      this.bgm = this.createMediaElement('bgm-claimed-by-void');
      this.bgm.loop = true;
      this.bgm.volume = 0.36;

      for (const stem of [
        'brick-hit',
        'brick-armored',
        'brick-break',
        'wall-hit',
        'heartbeat',
        'laser',
        'powerup-get',
        'level-complete',
      ] satisfies SfxStem[]) {
        this.pools.set(stem, new HtmlAudioPool(this.assetUrl(stem), stem === 'brick-hit' ? 3 : 2));
      }

      this.initialized = true;
      this.runtimeState = 'locked';
      console.info('[Rune Ball] Asset audio initialized.', this.debugState);
    } catch (error) {
      this.runtimeState = 'failed';
      this.bgm = null;
      this.pools.clear();
      console.warn('[Rune Ball] Asset audio initialization failed.', error);
    }
  }

  private performUnlock(): Promise<boolean> {
    const bgm = this.bgm;
    if (!bgm) return Promise.resolve(false);

    this.runtimeState = 'locked';
    const bgmAttempt = bgm.play()
      .then(() => true)
      .catch((error: unknown) => {
        console.warn('[Rune Ball] BGM playback failed.', error, this.debugState);
        return false;
      });

    const primeAttempt = Promise.all([...this.pools.values()].map((pool) => pool.prime()));

    return Promise.all([bgmAttempt, primeAttempt] as const).then(([bgmStarted, primeResults]) => {
      const primedVoices = primeResults.flat().filter(Boolean).length;

      if (bgmStarted) {
        this.runtimeState = 'playing';
        bgm.volume = this.overdrive ? 0.50 : 0.36 + this.flowIntensity * 0.08;
        console.info('[Rune Ball] Asset audio running.', this.debugState);
        return true;
      }

      this.runtimeState = primedVoices > 0 ? 'partial' : 'failed';
      console.warn('[Rune Ball] Asset audio did not start BGM.', {
        ...this.debugState,
        primedVoices,
      });
      return false;
    });
  }

  private createMediaElement(stem: string): HTMLAudioElement {
    const element = document.createElement('audio');
    element.src = this.assetUrl(stem);
    element.preload = 'auto';
    return element;
  }

  private assetUrl(stem: string): string {
    const format = this.format ?? 'mp3';
    return new URL(`audio/${stem}.${format}`, document.baseURI).toString();
  }

  private playSfx(stem: SfxStem, volume: number, playbackRate = 1): void {
    if (!this.enabled || (this.runtimeState !== 'playing' && this.runtimeState !== 'partial')) return;
    this.pools.get(stem)?.play(volume, playbackRate);
  }
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}
