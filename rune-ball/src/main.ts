import { AudioDirector } from './audio/AudioDirector';
import { createRenderer } from './bootstrap/create-renderer';
import { PreloadScreen } from './bootstrap/PreloadScreen';
import type { DestructionEvent } from './game/DestructionSession';
import { FixedStepLoop } from './game/FixedStepLoop';
import { SessionDirector } from './game/SessionDirector';
import {
  readRuntimePreferences,
  writeRuntimePreferences,
  type RuntimePreferences,
} from './preferences/RuntimePreferences';
import type { VortexEvolutionPath } from './progression/VortexEvolutionSystem';
import { DestructionScene } from './presentation/DestructionScene';
import { RuneCausalityOverlay } from './presentation/RuneCausalityOverlay';
import { SessionChrome } from './presentation/SessionChrome';
import { SettingsPanel } from './presentation/SettingsPanel';
import { VortexBuildPicker } from './presentation/VortexBuildPicker';
import { VortexEvolutionStatus } from './presentation/VortexEvolutionStatus';
import './style.css';
import './session.css';
import './settings.css';
import './evolution.css';

const hostElement = document.querySelector<HTMLElement>('#app');
if (!hostElement) throw new Error('[Rune Ball] Missing #app mount element');
const host: HTMLElement = hostElement;

function showBootstrapFailure(error: unknown, detailText: string): void {
  console.error('[Rune Ball] Application bootstrap failed.', error);
  host.dataset.bootstrapError = 'startup';
  host.dataset.bootstrapState = 'failed';
  host.setAttribute('aria-busy', 'false');
  host.replaceChildren();

  const panel = document.createElement('section');
  panel.className = 'bootstrap-error';
  panel.setAttribute('role', 'alert');

  const title = document.createElement('strong');
  title.textContent = 'Unable to start Rune Ball';
  const detail = document.createElement('span');
  detail.textContent = detailText;
  panel.append(title, detail);
  host.append(panel);
}

function preloadLabel(asset: string): string {
  if (asset.startsWith('decode:')) return 'DECODING EFFECTS';
  if (asset.startsWith('prepare:')) return 'PREPARING BGM';
  if (asset === 'ready') return 'READY';
  if (asset.startsWith('bgm-')) return 'LOADING BGM';
  return 'LOADING EFFECTS';
}

function getStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function systemPrefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function applyMotionPreference(enabled: boolean): void {
  document.documentElement.dataset.reducedMotion = String(enabled);
}

async function bootstrap(): Promise<void> {
  host.dataset.bootstrapState = 'starting';
  host.setAttribute('aria-busy', 'true');
  console.info('[Rune Ball] P7.2 Vortex Evolution bootstrap starting.');

  const storage = getStorage();
  let preferences: RuntimePreferences = readRuntimePreferences(storage, systemPrefersReducedMotion());
  applyMotionPreference(preferences.reducedMotion);

  const preloadScreen = new PreloadScreen(host);
  const audio = new AudioDirector();
  let pagePaused = document.visibilityState === 'hidden';
  let setRuntimePaused: (() => void) | null = null;

  const syncAppVisibility = (): void => {
    pagePaused = document.visibilityState === 'hidden';
    if (pagePaused) audio.pauseForBackground();
    else audio.resumeFromBackground();
    setRuntimePaused?.();
  };
  const handlePageHide = (): void => {
    pagePaused = true;
    audio.pauseForBackground();
    setRuntimePaused?.();
  };
  const handlePageShow = (): void => {
    if (document.visibilityState !== 'visible') return;
    pagePaused = false;
    audio.resumeFromBackground();
    setRuntimePaused?.();
  };

  document.addEventListener('visibilitychange', syncAppVisibility);
  window.addEventListener('pagehide', handlePageHide);
  window.addEventListener('pageshow', handlePageShow);

  try {
    preloadScreen.setProgress(0.04, 'INITIALIZING RENDERER');
    const app = await createRenderer(host);
    preloadScreen.setProgress(0.12, 'LOADING AUDIO');

    const audioReady = await audio.preload((progress) => {
      preloadScreen.setProgress(
        0.12 + progress.ratio * 0.88,
        preloadLabel(progress.activeAsset),
      );
    });

    if (!audioReady) throw new Error('Required runtime audio could not be preloaded and decoded.');

    preloadScreen.setReady();
    host.dataset.bootstrapState = 'awaiting-entry';
    host.setAttribute('aria-busy', 'false');
    await preloadScreen.waitForSuccessfulEnter(async () => {
      const unlocked = await audio.unlock();
      if (unlocked) audio.setEnabled(preferences.soundEnabled);
      return unlocked;
    });

    const session = new SessionDirector({ totalSeconds: 75, finalReleaseSeconds: 3 });
    let selectedPath: VortexEvolutionPath = 'gravity-well';
    let scene: DestructionScene;
    let chrome: SessionChrome;
    let causality: RuneCausalityOverlay | null = null;
    let settings: SettingsPanel | null = null;
    let buildPicker: VortexBuildPicker;
    let evolutionStatus: VortexEvolutionStatus | null = null;
    let resultHandled = false;
    let settingsOpen = false;
    let buildSelecting = true;
    let runtimePaused = false;

    const persistPreferences = (): void => {
      writeRuntimePreferences(storage, preferences);
    };

    const onGameplayEvent = (event: DestructionEvent): void => {
      session.registerEvent(event);
      causality?.handle(event);
      evolutionStatus?.handle(event);
      if (event.type === 'rune-activated' && session.start()) chrome.render(session.snapshot);
    };

    const createScene = (): DestructionScene => {
      const nextScene = new DestructionScene(
        app.screen.width,
        app.screen.height,
        audio,
        { onGameplayEvent, vortexEvolutionPath: selectedPath },
      );
      nextScene.setReducedMotion(preferences.reducedMotion);
      return nextScene;
    };

    scene = createScene();

    const loop = new FixedStepLoop(
      (dtSeconds) => {
        const phase = session.snapshot.phase;
        if (phase !== 'playing' && phase !== 'final-release') return;

        scene.update(dtSeconds);
        const transition = session.update(dtSeconds);
        chrome.render(session.snapshot);

        if (transition === 'results' && !resultHandled) {
          resultHandled = true;
          scene.setInputEnabled(false);
          evolutionStatus?.setVisible(false);
          audio.playResultSting();
          chrome.render(session.snapshot);
        }
      },
      (alpha) => scene.present(alpha),
    );

    const syncRuntimePause = (): void => {
      const nextPaused = pagePaused || settingsOpen || buildSelecting;
      const interactionEnabled = !nextPaused && session.snapshot.phase !== 'results';
      session.setPaused(nextPaused);
      scene.setInputEnabled(interactionEnabled);
      if (runtimePaused && !nextPaused) loop.reset();
      runtimePaused = nextPaused;
    };
    setRuntimePaused = syncRuntimePause;

    host.replaceChildren(app.canvas);
    app.canvas.classList.add('game-canvas');
    app.canvas.setAttribute('aria-label', 'Rune Ball P7.2 Vortex Evolution playtest');
    app.stage.addChild(scene);

    causality = new RuneCausalityOverlay(host);
    evolutionStatus = new VortexEvolutionStatus(host, selectedPath);
    evolutionStatus.setVisible(false);
    buildPicker = new VortexBuildPicker(host);

    const replaceSceneForBuild = (): void => {
      app.stage.removeChild(scene);
      scene.destroy({ children: true });
      scene = createScene();
      app.stage.addChild(scene);
    };

    const chooseBuild = async (): Promise<void> => {
      buildSelecting = true;
      evolutionStatus?.setVisible(false);
      syncRuntimePause();
      const nextPath = await buildPicker.choose(selectedPath);
      selectedPath = nextPath;
      replaceSceneForBuild();
      evolutionStatus?.reset(selectedPath);
      evolutionStatus?.setVisible(true);
      loop.reset();
      buildSelecting = false;
      syncRuntimePause();
    };

    const restartRun = (): void => {
      session.reset();
      causality?.reset();
      resultHandled = false;
      chrome.render(session.snapshot);
      void chooseBuild();
    };

    chrome = new SessionChrome(host, restartRun);
    chrome.render(session.snapshot);

    settings = new SettingsPanel(host, preferences, {
      onSoundChange: (enabled) => {
        preferences = { ...preferences, soundEnabled: enabled };
        audio.setEnabled(enabled);
        persistPreferences();
      },
      onReducedMotionChange: (enabled) => {
        preferences = { ...preferences, reducedMotion: enabled };
        applyMotionPreference(enabled);
        scene.setReducedMotion(enabled);
        persistPreferences();
      },
      onOpenChange: (open) => {
        settingsOpen = open;
        syncRuntimePause();
      },
    });
    settings.setPreferences(preferences);

    syncRuntimePause();
    void chooseBuild();

    app.ticker.add((ticker) => {
      if (!runtimePaused) loop.tick(ticker.deltaMS);
    });

    const resizeObserver = new ResizeObserver(() => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      app.renderer.resize(width, height);
      scene.setViewport(width, height);
    });
    resizeObserver.observe(host);

    host.dataset.bootstrapState = 'ready';
    delete host.dataset.bootstrapError;
    host.setAttribute('aria-busy', 'false');
    console.info('[Rune Ball] P7.2 ready. Choose a Vortex path, then qualify uses to evolve automatically.');
  } catch (error) {
    showBootstrapFailure(
      error,
      'Required renderer or audio resources could not be prepared. Reload the page and try again.',
    );
  }
}

void bootstrap();
