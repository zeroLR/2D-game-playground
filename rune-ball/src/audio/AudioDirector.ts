import type { ImpactSource } from '../game/DestructionSession';
import type { RuneKind } from '../rune/RuneTypes';

interface MixState {
  flowIntensity: number;
  overdrive: boolean;
}

type AudioFormat = 'ogg' | 'mp3';
type AudioRuntimeState =
  | 'uninitialized'
  | 'preloading'
  | 'ready'
  | 'locked'
  | 'warming'
  | 'playing'
  | 'partial'
  | 'failed'
  | 'unavailable';
type SfxStem =
  | 'brick-hit'
  | 'brick-armored'
  | 'brick-break'
  | 'wall-hit'
  | 'heartbeat'
  | 'laser'
  | 'powerup-get'
  | 'level-complete';
type RuntimeStem = 'bgm-claimed-by-void' | SfxStem;

const SFX_STEMS: SfxStem[] = [
  'brick-hit',
  'brick-armored',
  'brick-break',
  'wall-hit',
  'heartbeat',
  'laser',
  'powerup-get',
  'level-complete',
];
const RUNTIME_STEMS: RuntimeStem[] = ['bgm-claimed-by-void', ...SFX_STEMS];
const MEDIA_READY_TIMEOUT_MS = 6000;

export interface AudioPreloadProgress {
  ratio: number;
  loadedBytes: number;
  totalBytes: number;
  completedAssets: number;
  totalAssets: number;
  activeAsset: string;
  format: AudioFormat;
}

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
    this.voices = Array.from({ length: voiceCount }, () => createAudioElement(url));
  }

  async prepare(): Promise<void> {
    await Promise.all(this.voices.map((voice) => waitUntilMediaReady(voice)));
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
  private readonly objectUrls: string[] = [];
  private unlockPromise: Promise<boolean> | null = null;
  private preloadPromise: Promise<boolean> | null = null;
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

  async preload(onProgress?: (progress: AudioPreloadProgress) => void): Promise<boolean> {
    if (!this.enabled || !this.supported) return false;
    if (this.runtimeState === 'ready' || this.runtimeState === 'playing') return true;
    if (this.preloadPromise) return this.preloadPromise;

    this.preloadPromise = this.performPreload(onProgress).finally(() => {
      this.preloadPromise = null;
    });
    return this.preloadPromise;
  }

  async unlock(): Promise<boolean> {
    if (!this.enabled || !this.supported) return false;
    if (this.runtimeState === 'playing' && this.bgm && !this.bgm.paused) return true;
    if (this.runtimeState !== 'ready' && this.runtimeState !== 'locked' && this.runtimeState !== 'partial') {
      console.warn('[Rune Ball] Audio unlock requested before preload completed.', this.debugState);
      return false;
    }
    if (!this.bgm) return false;
    if (this.unlockPromise) return this.unlockPromise;

    // performUnlock invokes all play() calls before its first await so the warm-up
    // stays inside the user's activation chain. Gameplay starts only after it resolves.
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
    return typeof document !== 'undefined'
      && typeof document.createElement === 'function'
      && typeof fetch === 'function'
      && typeof URL !== 'undefined'
      && typeof URL.createObjectURL === 'function';
  }

  private initializeFormat(): void {
    if (!this.supported) {
      this.runtimeState = 'unavailable';
      return;
    }

    const probe = document.createElement('audio');
    const oggSupport = probe.canPlayType('audio/ogg; codecs="vorbis"');
    this.format = oggSupport === 'probably' || oggSupport === 'maybe' ? 'ogg' : 'mp3';
    this.initialized = true;
  }

  private async performPreload(onProgress?: (progress: AudioPreloadProgress) => void): Promise<boolean> {
    if (!this.initialized) this.initializeFormat();
    if (!this.format) return false;

    this.runtimeState = 'preloading';
    const preferredFormat = this.format;

    try {
      await this.loadRuntimeAssets(preferredFormat, onProgress);
      this.runtimeState = 'ready';
      console.info('[Rune Ball] Asset audio preloaded.', this.debugState);
      return true;
    } catch (preferredError) {
      console.warn(`[Rune Ball] ${preferredFormat.toUpperCase()} preload failed.`, preferredError);
      this.releaseRuntimeAssets();

      if (preferredFormat === 'ogg') {
        try {
          this.format = 'mp3';
          await this.loadRuntimeAssets('mp3', onProgress);
          this.runtimeState = 'ready';
          console.info('[Rune Ball] Asset audio preloaded with MP3 fallback.', this.debugState);
          return true;
        } catch (fallbackError) {
          console.warn('[Rune Ball] MP3 fallback preload failed.', fallbackError);
        }
      }

      this.runtimeState = 'failed';
      return false;
    }
  }

  private async loadRuntimeAssets(
    format: AudioFormat,
    onProgress?: (progress: AudioPreloadProgress) => void,
  ): Promise<void> {
    this.format = format;
    const loadedByStem = new Map<RuntimeStem, number>();
    const totalByStem = new Map<RuntimeStem, number>();
    const completed = new Set<RuntimeStem>();
    let lastRatio = 0;

    const report = (activeAsset: RuntimeStem): void => {
      const loadedBytes = [...loadedByStem.values()].reduce((sum, value) => sum + value, 0);
      const totalBytes = [...totalByStem.values()].reduce((sum, value) => sum + value, 0);
      const byteRatio = totalBytes > 0 ? loadedBytes / totalBytes : 0;
      const fileRatio = completed.size / RUNTIME_STEMS.length;
      const ratio = Math.min(1, Math.max(lastRatio, totalBytes > 0 ? byteRatio : fileRatio));
      lastRatio = ratio;
      onProgress?.({
        ratio,
        loadedBytes,
        totalBytes,
        completedAssets: completed.size,
        totalAssets: RUNTIME_STEMS.length,
        activeAsset,
        format,
      });
    };

    const blobs = await Promise.all(RUNTIME_STEMS.map(async (stem) => {
      const url = new URL(`audio/${stem}.${format}`, document.baseURI).toString();
      const response = await fetch(url, { cache: 'force-cache' });
      if (!response.ok) throw new Error(`${stem}.${format} preload returned HTTP ${response.status}`);

      const declaredLength = Number(response.headers.get('content-length') ?? 0);
      if (Number.isFinite(declaredLength) && declaredLength > 0) totalByStem.set(stem, declaredLength);
      report(stem);

      const blob = await readResponseBlob(response, (loaded) => {
        loadedByStem.set(stem, loaded);
        report(stem);
      }, format);

      loadedByStem.set(stem, blob.size);
      if (!totalByStem.has(stem)) totalByStem.set(stem, blob.size);
      completed.add(stem);
      report(stem);
      return [stem, blob] as const;
    }));

    const objectUrlByStem = new Map<RuntimeStem, string>();
    for (const [stem, blob] of blobs) {
      const objectUrl = URL.createObjectURL(blob);
      this.objectUrls.push(objectUrl);
      objectUrlByStem.set(stem, objectUrl);
    }

    const bgmUrl = objectUrlByStem.get('bgm-claimed-by-void');
    if (!bgmUrl) throw new Error('BGM blob URL missing after preload.');

    this.bgm = createAudioElement(bgmUrl);
    this.bgm.loop = true;
    this.bgm.volume = 0.36;

    for (const stem of SFX_STEMS) {
      const url = objectUrlByStem.get(stem);
      if (!url) throw new Error(`${stem} blob URL missing after preload.`);
      this.pools.set(stem, new HtmlAudioPool(url, stem === 'brick-hit' ? 3 : 2));
    }

    await Promise.all([
      waitUntilMediaReady(this.bgm),
      ...[...this.pools.values()].map((pool) => pool.prepare()),
    ]);

    onProgress?.({
      ratio: 1,
      loadedBytes: [...loadedByStem.values()].reduce((sum, value) => sum + value, 0),
      totalBytes: [...totalByStem.values()].reduce((sum, value) => sum + value, 0),
      completedAssets: RUNTIME_STEMS.length,
      totalAssets: RUNTIME_STEMS.length,
      activeAsset: 'bgm-claimed-by-void',
      format,
    });
  }

  private performUnlock(): Promise<boolean> {
    const bgm = this.bgm;
    if (!bgm) return Promise.resolve(false);

    this.runtimeState = 'warming';
    const bgmAttempt = bgm.play()
      .then(() => true)
      .catch((error: unknown) => {
        console.warn('[Rune Ball] BGM playback failed.', error, this.debugState);
        return false;
      });

    // Every voice is touched before gameplay starts. This intentionally moves any
    // first-play decoder cost out of Rune / impact events and into the enter gate.
    const primeAttempt = Promise.all([...this.pools.values()].map((pool) => pool.prime()));

    return Promise.all([bgmAttempt, primeAttempt] as const).then(([bgmStarted, primeResults]) => {
      const primedVoices = primeResults.flat().filter(Boolean).length;
      const totalVoices = primeResults.flat().length;

      if (bgmStarted && primedVoices === totalVoices) {
        this.runtimeState = 'playing';
        bgm.volume = this.overdrive ? 0.50 : 0.36 + this.flowIntensity * 0.08;
        console.info('[Rune Ball] Asset audio warmed and running.', {
          ...this.debugState,
          primedVoices,
        });
        return true;
      }

      if (bgmStarted && primedVoices > 0) {
        this.runtimeState = 'partial';
        console.warn('[Rune Ball] Audio warm-up was partial.', {
          ...this.debugState,
          primedVoices,
          totalVoices,
        });
        return true;
      }

      this.runtimeState = primedVoices > 0 ? 'partial' : 'locked';
      console.warn('[Rune Ball] Asset audio did not start BGM.', {
        ...this.debugState,
        primedVoices,
        totalVoices,
      });
      return false;
    });
  }

  private releaseRuntimeAssets(): void {
    this.bgm?.pause();
    this.bgm = null;
    for (const pool of this.pools.values()) pool.pauseAll();
    this.pools.clear();
    for (const objectUrl of this.objectUrls.splice(0)) URL.revokeObjectURL(objectUrl);
  }

  private playSfx(stem: SfxStem, volume: number, playbackRate = 1): void {
    if (!this.enabled || (this.runtimeState !== 'playing' && this.runtimeState !== 'partial')) return;
    this.pools.get(stem)?.play(volume, playbackRate);
  }
}

async function readResponseBlob(
  response: Response,
  onLoaded: (loadedBytes: number) => void,
  format: AudioFormat,
): Promise<Blob> {
  if (!response.body) {
    const blob = await response.blob();
    onLoaded(blob.size);
    return blob;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let loadedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    chunks.push(value);
    loadedBytes += value.byteLength;
    onLoaded(loadedBytes);
  }

  return new Blob(chunks, { type: format === 'ogg' ? 'audio/ogg' : 'audio/mpeg' });
}

function createAudioElement(url: string): HTMLAudioElement {
  const element = document.createElement('audio');
  element.src = url;
  element.preload = 'auto';
  return element;
}

function waitUntilMediaReady(element: HTMLAudioElement): Promise<void> {
  if (element.readyState >= 2) return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    const finish = (): void => {
      if (settled) return;
      settled = true;
      element.removeEventListener('canplay', finish);
      element.removeEventListener('loadeddata', finish);
      element.removeEventListener('error', finish);
      resolve();
    };

    element.addEventListener('canplay', finish, { once: true });
    element.addEventListener('loadeddata', finish, { once: true });
    element.addEventListener('error', finish, { once: true });
    element.load();
    window.setTimeout(finish, MEDIA_READY_TIMEOUT_MS);
  });
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}
