import { withTimeout } from '../bootstrap/with-timeout';
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
  | 'warming'
  | 'playing'
  | 'partial'
  | 'locked'
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
type AudioContextConstructor = new () => AudioContext;

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
const DOWNLOAD_PHASE_RATIO = 0.70;
const DECODE_PHASE_RATIO = 0.26;
const MEDIA_READY_TIMEOUT_MS = 2500;
const ACTIVATION_TIMEOUT_MS = 1800;
const MAX_ACTIVE_SFX = 28;

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
  contextState: AudioContextState | 'unavailable' | 'uninitialized';
  decodedSfx: number;
}

export class AudioDirector {
  private enabled = true;
  private initialized = false;
  private runtimeState: AudioRuntimeState = 'uninitialized';
  private format: AudioFormat | null = null;
  private context: AudioContext | null = null;
  private sfxBus: GainNode | null = null;
  private bgm: HTMLAudioElement | null = null;
  private bgmObjectUrl: string | null = null;
  private readonly sfxBuffers = new Map<SfxStem, AudioBuffer>();
  private preloadPromise: Promise<boolean> | null = null;
  private unlockPromise: Promise<boolean> | null = null;
  private flowIntensity = 0;
  private overdrive = false;
  private activeSfx = 0;

  get debugState(): AudioDebugState {
    const supported = this.supported;
    return {
      supported,
      enabled: this.enabled,
      initialized: this.initialized,
      state: supported ? this.runtimeState : 'unavailable',
      format: this.format,
      contextState: this.context?.state ?? (supported ? 'uninitialized' : 'unavailable'),
      decodedSfx: this.sfxBuffers.size,
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
    if (this.runtimeState === 'playing' && this.audioContextRunning && this.bgm && !this.bgm.paused) return true;
    if (!this.context || !this.bgm || !['ready', 'partial', 'locked'].includes(this.runtimeState)) {
      console.warn('[Rune Ball] Audio activation requested before preload completed.', this.debugState);
      return false;
    }
    if (this.unlockPromise) return this.unlockPromise;

    this.unlockPromise = this.performUnlock().finally(() => {
      this.unlockPromise = null;
    });
    return this.unlockPromise;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (this.sfxBus && this.context) {
      this.sfxBus.gain.setTargetAtTime(enabled ? 0.95 : 0.0001, this.context.currentTime, 0.02);
    }

    if (!enabled) {
      this.bgm?.pause();
      return;
    }

    if ((this.runtimeState === 'playing' || this.runtimeState === 'partial') && this.bgm) {
      void this.bgm.play().catch(() => {
        this.runtimeState = this.audioContextRunning ? 'partial' : 'locked';
      });
    }
  }

  update(state: MixState): void {
    this.flowIntensity = clamp01(state.flowIntensity);
    this.overdrive = state.overdrive;
    if (!this.bgm || this.bgm.paused || !this.enabled) return;

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
      && this.getAudioContextConstructor() !== null;
  }

  private get audioContextRunning(): boolean {
    return this.context?.state === 'running';
  }

  private initializeRuntime(): void {
    if (!this.supported) {
      this.runtimeState = 'unavailable';
      return;
    }

    const probe = document.createElement('audio');
    const oggSupport = probe.canPlayType('audio/ogg; codecs="vorbis"');
    this.format = oggSupport === 'probably' || oggSupport === 'maybe' ? 'ogg' : 'mp3';

    const AudioContextCtor = this.getAudioContextConstructor();
    if (!AudioContextCtor) {
      this.runtimeState = 'unavailable';
      return;
    }

    this.context = new AudioContextCtor();
    this.sfxBus = this.context.createGain();
    this.sfxBus.gain.value = 0.95;
    this.sfxBus.connect(this.context.destination);
    this.initialized = true;
  }

  private async performPreload(onProgress?: (progress: AudioPreloadProgress) => void): Promise<boolean> {
    if (!this.initialized) this.initializeRuntime();
    if (!this.context || !this.format) return false;

    this.runtimeState = 'preloading';
    const preferredFormat = this.format;

    try {
      await this.loadRuntimeAssets(preferredFormat, onProgress);
      this.runtimeState = 'ready';
      console.info('[Rune Ball] Audio bytes downloaded and SFX decoded before entry.', this.debugState);
      return true;
    } catch (preferredError) {
      console.warn(`[Rune Ball] ${preferredFormat.toUpperCase()} audio preload/decode failed.`, preferredError);
      this.releaseRuntimeAssets();

      if (preferredFormat === 'ogg') {
        try {
          this.format = 'mp3';
          await this.loadRuntimeAssets('mp3', onProgress);
          this.runtimeState = 'ready';
          console.info('[Rune Ball] Audio preloaded with MP3 fallback.', this.debugState);
          return true;
        } catch (fallbackError) {
          console.warn('[Rune Ball] MP3 audio preload/decode failed.', fallbackError);
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
    const context = this.context;
    if (!context) throw new Error('AudioContext missing during preload.');

    this.format = format;
    const loadedByStem = new Map<RuntimeStem, number>();
    const totalByStem = new Map<RuntimeStem, number>();
    const completed = new Set<RuntimeStem>();
    const rawByStem = new Map<RuntimeStem, ArrayBuffer>();
    let lastRatio = 0;

    const report = (activeAsset: string, phaseRatio: number): void => {
      const loadedBytes = [...loadedByStem.values()].reduce((sum, value) => sum + value, 0);
      const totalBytes = [...totalByStem.values()].reduce((sum, value) => sum + value, 0);
      const ratio = Math.min(1, Math.max(lastRatio, phaseRatio));
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

    await Promise.all(RUNTIME_STEMS.map(async (stem) => {
      const url = new URL(`audio/${stem}.${format}`, document.baseURI).toString();
      const response = await fetch(url, { cache: 'force-cache' });
      if (!response.ok) throw new Error(`${stem}.${format} returned HTTP ${response.status}`);

      const declaredLength = Number(response.headers.get('content-length') ?? 0);
      if (Number.isFinite(declaredLength) && declaredLength > 0) totalByStem.set(stem, declaredLength);

      const buffer = await readResponseArrayBuffer(response, (loaded) => {
        loadedByStem.set(stem, loaded);
        const loadedBytes = [...loadedByStem.values()].reduce((sum, value) => sum + value, 0);
        const totalBytes = [...totalByStem.values()].reduce((sum, value) => sum + value, 0);
        const byteRatio = totalBytes > 0 ? loadedBytes / totalBytes : completed.size / RUNTIME_STEMS.length;
        report(stem, clamp01(byteRatio) * DOWNLOAD_PHASE_RATIO);
      });

      rawByStem.set(stem, buffer);
      loadedByStem.set(stem, buffer.byteLength);
      if (!totalByStem.has(stem)) totalByStem.set(stem, buffer.byteLength);
      completed.add(stem);
      report(stem, (completed.size / RUNTIME_STEMS.length) * DOWNLOAD_PHASE_RATIO);
    }));

    for (let index = 0; index < SFX_STEMS.length; index += 1) {
      const stem = SFX_STEMS[index];
      const raw = rawByStem.get(stem);
      if (!raw) throw new Error(`${stem} bytes missing before decode.`);
      const decoded = await context.decodeAudioData(raw.slice(0));
      this.sfxBuffers.set(stem, decoded);
      report(`decode:${stem}`, DOWNLOAD_PHASE_RATIO + ((index + 1) / SFX_STEMS.length) * DECODE_PHASE_RATIO);
    }

    const bgmBytes = rawByStem.get('bgm-claimed-by-void');
    if (!bgmBytes) throw new Error('BGM bytes missing after preload.');

    const bgmBlob = new Blob([bgmBytes], { type: format === 'ogg' ? 'audio/ogg' : 'audio/mpeg' });
    this.bgmObjectUrl = URL.createObjectURL(bgmBlob);
    this.bgm = createAudioElement(this.bgmObjectUrl);
    this.bgm.loop = true;
    this.bgm.volume = 0.36;
    report('prepare:bgm-claimed-by-void', DOWNLOAD_PHASE_RATIO + DECODE_PHASE_RATIO);
    await waitUntilMediaReady(this.bgm);

    report('ready', 1);
  }

  private async performUnlock(): Promise<boolean> {
    const context = this.context;
    const bgm = this.bgm;
    if (!context || !bgm) return false;

    this.runtimeState = 'warming';

    // Both activation calls are issued synchronously from the Enter click handler.
    // No media decoding, seeking, or SFX priming is allowed in this phase.
    const resumeAttempt = context.state === 'running'
      ? Promise.resolve(true)
      : context.resume().then(() => context.state === 'running').catch((error: unknown) => {
          console.warn('[Rune Ball] AudioContext resume failed.', error);
          return false;
        });
    const bgmAttempt = bgm.play().then(() => true).catch((error: unknown) => {
      console.warn('[Rune Ball] BGM activation failed.', error);
      return false;
    });

    try {
      const [contextRunning, bgmStarted] = await withTimeout(
        Promise.all([resumeAttempt, bgmAttempt] as const),
        ACTIVATION_TIMEOUT_MS,
        'audio activation',
      );
      return this.finishActivation(contextRunning, bgmStarted);
    } catch (error) {
      console.warn('[Rune Ball] Audio activation timed out; returning control to the entry screen.', error, this.debugState);
      return this.finishActivation(context.state === 'running', !bgm.paused);
    }
  }

  private finishActivation(contextRunning: boolean, bgmStarted: boolean): boolean {
    if (contextRunning && bgmStarted) {
      this.runtimeState = 'playing';
      if (this.bgm) this.bgm.volume = this.overdrive ? 0.50 : 0.36 + this.flowIntensity * 0.08;
      console.info('[Rune Ball] Buffered SFX audio runtime active.', this.debugState);
      return true;
    }

    if (contextRunning || bgmStarted) {
      this.runtimeState = 'partial';
      console.warn('[Rune Ball] Audio runtime activated partially.', this.debugState);
      return true;
    }

    this.runtimeState = 'locked';
    return false;
  }

  private playSfx(stem: SfxStem, volume: number, playbackRate = 1): void {
    const context = this.context;
    const destination = this.sfxBus;
    const buffer = this.sfxBuffers.get(stem);
    if (!this.enabled || !context || !destination || !buffer || context.state !== 'running') return;
    if (this.activeSfx >= MAX_ACTIVE_SFX) return;

    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.playbackRate.value = Math.min(1.6, Math.max(0.55, playbackRate));
    gain.gain.value = clamp01(volume);
    source.connect(gain);
    gain.connect(destination);

    this.activeSfx += 1;
    source.onended = () => {
      this.activeSfx = Math.max(0, this.activeSfx - 1);
      source.disconnect();
      gain.disconnect();
    };
    source.start();
  }

  private releaseRuntimeAssets(): void {
    this.bgm?.pause();
    this.bgm = null;
    if (this.bgmObjectUrl) {
      URL.revokeObjectURL(this.bgmObjectUrl);
      this.bgmObjectUrl = null;
    }
    this.sfxBuffers.clear();
    this.activeSfx = 0;
  }

  private getAudioContextConstructor(): AudioContextConstructor | null {
    if (typeof window === 'undefined') return null;
    const audioWindow = window as typeof window & { webkitAudioContext?: AudioContextConstructor };
    return audioWindow.AudioContext ?? audioWindow.webkitAudioContext ?? null;
  }
}

async function readResponseArrayBuffer(
  response: Response,
  onLoaded: (loadedBytes: number) => void,
): Promise<ArrayBuffer> {
  if (!response.body) {
    const buffer = await response.arrayBuffer();
    onLoaded(buffer.byteLength);
    return buffer;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let loadedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    const copy = new Uint8Array(new ArrayBuffer(value.byteLength));
    copy.set(value);
    chunks.push(copy);
    loadedBytes += copy.byteLength;
    onLoaded(loadedBytes);
  }

  const result = new Uint8Array(new ArrayBuffer(loadedBytes));
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return result.buffer;
}

function createAudioElement(url: string): HTMLAudioElement {
  const element = document.createElement('audio');
  element.src = url;
  element.preload = 'auto';
  return element;
}

async function waitUntilMediaReady(element: HTMLAudioElement): Promise<void> {
  if (element.readyState >= 2) return;

  await withTimeout(new Promise<void>((resolve, reject) => {
    const cleanup = (): void => {
      element.removeEventListener('canplay', ready);
      element.removeEventListener('loadeddata', ready);
      element.removeEventListener('error', failed);
    };
    const ready = (): void => {
      cleanup();
      resolve();
    };
    const failed = (): void => {
      cleanup();
      reject(new Error('BGM media element failed to prepare.'));
    };

    element.addEventListener('canplay', ready, { once: true });
    element.addEventListener('loadeddata', ready, { once: true });
    element.addEventListener('error', failed, { once: true });
    element.load();
  }), MEDIA_READY_TIMEOUT_MS, 'BGM media preparation');
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}
