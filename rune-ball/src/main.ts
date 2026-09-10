import { AudioDirector } from './audio/AudioDirector';
import { createRenderer } from './bootstrap/create-renderer';
import { StageLoadingScreen } from './bootstrap/StageLoadingScreen';
import { getStage, type StageId } from './content/StageCatalog';
import type { DestructionEvent } from './game/DestructionSession';
import { FixedStepLoop } from './game/FixedStepLoop';
import { SessionDirector } from './game/SessionDirector';
import {
  readRuntimePreferences,
  writeRuntimePreferences,
  type RuntimePreferences,
} from './preferences/RuntimePreferences';
import { readPlayerProfile, writePlayerProfile, type PlayerProfile } from './profile/PlayerProfile';
import type { VortexEvolutionPath } from './progression/VortexEvolutionSystem';
import { DestructionScene } from './presentation/DestructionScene';
import { GameShell } from './presentation/GameShell';
import { RuneCausalityOverlay } from './presentation/RuneCausalityOverlay';
import { SessionChrome } from './presentation/SessionChrome';
import { SettingsPanel } from './presentation/SettingsPanel';
import { VortexEvolutionStatus } from './presentation/VortexEvolutionStatus';
import './style.css';
import './session.css';
import './settings.css';
import './evolution.css';
import './product-shell.css';

const hostElement = document.querySelector<HTMLElement>('#app');
if (!hostElement) throw new Error('[Rune Ball] Missing #app mount element');
const host: HTMLElement = hostElement;

type RuneBallApplication = Awaited<ReturnType<typeof createRenderer>>;

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
  title.textContent = 'Unable to enter Rune Ball';
  const detail = document.createElement('span');
  detail.textContent = detailText;
  panel.append(title, detail);
  host.append(panel);
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

function bootstrap(): void {
  host.dataset.bootstrapState = 'ready';
  host.dataset.appScreen = 'home';
  host.setAttribute('aria-busy', 'false');
  console.info('[Rune Ball] P8.1.1 Home-first shell ready. Gameplay runtime will load on stage entry.');

  const storage = getStorage();
  let preferences: RuntimePreferences = readRuntimePreferences(storage, systemPrefersReducedMotion());
  let profile: PlayerProfile = readPlayerProfile(storage);
  let selectedPath: VortexEvolutionPath = profile.vortexPath;
  applyMotionPreference(preferences.reducedMotion);

  const audio = new AudioDirector();
  const stageLoadingScreen = new StageLoadingScreen(host);
  let app: RuneBallApplication | null = null;
  let scene: DestructionScene | null = null;
  let chrome: SessionChrome | null = null;
  let causality: RuneCausalityOverlay | null = null;
  let evolutionStatus: VortexEvolutionStatus | null = null;
  let loop: FixedStepLoop | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let session = new SessionDirector({ totalSeconds: 75, finalReleaseSeconds: 3 });
  let shell: GameShell;
  let runtimeLoadPromise: Promise<void> | null = null;
  let runtimeLoaded = false;
  let runtimeProgress = 0;
  let runHasStarted = false;
  let resultHandled = false;
  let settingsOpen = false;
  let productShellOpen = true;
  let stageLoading = false;
  let stageLoadInFlight = false;
  let pagePaused = document.visibilityState === 'hidden';
  let runtimePaused = true;

  const persistPreferences = (): void => {
    writeRuntimePreferences(storage, preferences);
  };

  const persistProfile = (): void => {
    writePlayerProfile(storage, profile);
  };

  const syncRuntimePause = (): void => {
    const nextPaused = pagePaused || settingsOpen || productShellOpen || stageLoading || !runtimeLoaded;
    const interactionEnabled = !nextPaused && session.snapshot.phase !== 'results';
    session.setPaused(nextPaused);
    scene?.setInputEnabled(interactionEnabled);
    if (runtimePaused && !nextPaused) loop?.reset();
    runtimePaused = nextPaused;
  };

  const syncAppVisibility = (): void => {
    pagePaused = document.visibilityState === 'hidden';
    if (pagePaused) audio.pauseForBackground();
    else audio.resumeFromBackground();
    syncRuntimePause();
  };

  const handlePageHide = (): void => {
    pagePaused = true;
    audio.pauseForBackground();
    syncRuntimePause();
  };

  const handlePageShow = (): void => {
    if (document.visibilityState !== 'visible') return;
    pagePaused = false;
    audio.resumeFromBackground();
    syncRuntimePause();
  };

  document.addEventListener('visibilitychange', syncAppVisibility);
  window.addEventListener('pagehide', handlePageHide);
  window.addEventListener('pageshow', handlePageShow);

  const onGameplayEvent = (event: DestructionEvent): void => {
    session.registerEvent(event);
    causality?.handle(event);
    evolutionStatus?.handle(event);
    if (event.type === 'rune-activated' && session.start()) chrome?.render(session.snapshot);
  };

  const createScene = (): DestructionScene => {
    const currentApp = app;
    if (!currentApp) throw new Error('Renderer missing while creating gameplay scene.');
    const nextScene = new DestructionScene(
      currentApp.screen.width,
      currentApp.screen.height,
      audio,
      { onGameplayEvent, vortexEvolutionPath: selectedPath },
    );
    nextScene.setReducedMotion(preferences.reducedMotion);
    return nextScene;
  };

  const replaceScene = (): void => {
    const currentApp = app;
    const currentScene = scene;
    if (!currentApp || !currentScene) throw new Error('Gameplay scene cannot be replaced before runtime setup.');
    currentApp.stage.removeChild(currentScene);
    currentScene.destroy({ children: true });
    scene = createScene();
    currentApp.stage.addChild(scene);
  };

  const prepareRun = (): void => {
    if (!app || !scene || !chrome || !causality || !evolutionStatus || !loop) {
      throw new Error('Gameplay runtime was not fully prepared before run start.');
    }

    session.reset();
    causality.reset();
    resultHandled = false;
    if (runHasStarted) replaceScene();
    else runHasStarted = true;
    evolutionStatus.reset(selectedPath);
    evolutionStatus.setVisible(true);
    chrome.render(session.snapshot);
    chrome.setVisible(true);
    productShellOpen = false;
    stageLoading = false;
    stageLoadingScreen.hide();
    shell.hideForRun();
    host.dataset.bootstrapState = 'ready';
    loop.reset();
    syncRuntimePause();
  };

  const restartRun = (): void => {
    prepareRun();
  };

  const returnHome = (): void => {
    session.reset();
    causality?.reset();
    resultHandled = false;
    evolutionStatus?.setVisible(false);
    chrome?.render(session.snapshot);
    chrome?.setVisible(false);
    productShellOpen = true;
    shell.showHome();
    syncRuntimePause();
  };

  const setupRuntime = (nextApp: RuneBallApplication): void => {
    app = nextApp;
    nextApp.canvas.classList.add('game-canvas');
    nextApp.canvas.setAttribute('aria-label', 'Rune Ball arena');
    nextApp.canvas.addEventListener('pointerdown', () => {
      if (!preferences.soundEnabled) return;
      const state = audio.debugState.state;
      if (state === 'ready' || state === 'partial' || state === 'locked') void audio.unlock();
    });
    host.prepend(nextApp.canvas);

    scene = createScene();
    nextApp.stage.addChild(scene);
    causality = new RuneCausalityOverlay(host);
    evolutionStatus = new VortexEvolutionStatus(host, selectedPath);
    evolutionStatus.setVisible(false);

    chrome = new SessionChrome(host, {
      onRetry: restartRun,
      onHome: returnHome,
    });
    chrome.setViewport(nextApp.screen.width, nextApp.screen.height);
    chrome.render(session.snapshot);
    chrome.setVisible(false);

    loop = new FixedStepLoop(
      (dtSeconds) => {
        const currentScene = scene;
        const currentChrome = chrome;
        const currentEvolutionStatus = evolutionStatus;
        if (!currentScene || !currentChrome || !currentEvolutionStatus) return;

        const phase = session.snapshot.phase;
        if (phase !== 'playing' && phase !== 'final-release') return;

        currentScene.update(dtSeconds);
        const transition = session.update(dtSeconds);
        currentChrome.render(session.snapshot);

        if (transition === 'results' && !resultHandled) {
          resultHandled = true;
          currentScene.setInputEnabled(false);
          currentEvolutionStatus.setVisible(false);
          audio.playResultSting();
          currentChrome.render(session.snapshot);
        }
      },
      (alpha) => scene?.present(alpha),
    );

    nextApp.ticker.add((ticker) => {
      if (!runtimePaused) loop?.tick(ticker.deltaMS);
    });

    resizeObserver = new ResizeObserver(() => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      nextApp.renderer.resize(width, height);
      scene?.setViewport(width, height);
      chrome?.setViewport(width, height);
    });
    resizeObserver.observe(host);
    runtimeLoaded = true;
    syncRuntimePause();
  };

  const ensureRuntime = async (): Promise<void> => {
    if (runtimeLoaded) {
      runtimeProgress = 1;
      stageLoadingScreen.setProgress(1);
      return;
    }

    if (!runtimeLoadPromise) {
      runtimeLoadPromise = (async () => {
        let nextApp: RuneBallApplication | null = null;
        try {
          runtimeProgress = 0.08;
          stageLoadingScreen.setProgress(runtimeProgress);
          nextApp = await createRenderer(host);
          runtimeProgress = 0.16;
          stageLoadingScreen.setProgress(runtimeProgress);

          const audioReady = await audio.preload((progress) => {
            runtimeProgress = 0.16 + progress.ratio * 0.84;
            stageLoadingScreen.setProgress(runtimeProgress);
          });
          if (!audioReady) throw new Error('Required runtime audio could not be preloaded and decoded.');

          runtimeProgress = 1;
          stageLoadingScreen.setProgress(1);
          setupRuntime(nextApp);
        } catch (error) {
          if (nextApp && nextApp !== app) {
            try {
              nextApp.destroy(true);
            } catch {
              // Best-effort cleanup when stage runtime preparation fails.
            }
          }
          throw error;
        }
      })();
    }

    await runtimeLoadPromise;
  };

  const beginStageEntry = (stageId: StageId): void => {
    if (stageLoadInFlight) return;
    stageLoadInFlight = true;
    const stage = getStage(stageId);
    host.dataset.activeStage = stageId;
    host.dataset.bootstrapState = 'stage-loading';
    console.info(`[Rune Ball] Loading stage ${stageId} with Vortex path ${selectedPath}.`);

    shell.hideForLoading();
    stageLoading = true;
    stageLoadingScreen.show(stage.title, runtimeProgress);
    syncRuntimePause();

    if (runtimeLoaded && preferences.soundEnabled) void audio.unlock();

    void (async () => {
      try {
        await ensureRuntime();
        if (preferences.soundEnabled) {
          const unlocked = await audio.unlock();
          if (!unlocked) {
            console.info('[Rune Ball] Audio remains gesture-locked; first arena pointer input will retry activation.');
          }
        } else {
          audio.setEnabled(false);
        }
        prepareRun();
      } catch (error) {
        showBootstrapFailure(
          error,
          'The selected stage could not prepare its renderer or audio resources. Reload the page and try again.',
        );
      } finally {
        stageLoadInFlight = false;
      }
    })();
  };

  shell = new GameShell(host, selectedPath, {
    onStartStage: beginStageEntry,
    onVortexPathChange: (path) => {
      selectedPath = path;
      profile = { ...profile, vortexPath: path };
      persistProfile();
    },
    onScreenChange: (screen) => {
      host.dataset.appScreen = screen;
      productShellOpen = screen !== 'run' && screen !== 'loading';
      if (screen !== 'run') {
        chrome?.setVisible(false);
        evolutionStatus?.setVisible(false);
      }
      syncRuntimePause();
    },
  });

  const settings = new SettingsPanel(host, preferences, {
    onSoundChange: (enabled) => {
      preferences = { ...preferences, soundEnabled: enabled };
      if (runtimeLoaded) {
        audio.setEnabled(enabled);
        if (enabled) void audio.unlock();
      }
      persistPreferences();
    },
    onReducedMotionChange: (enabled) => {
      preferences = { ...preferences, reducedMotion: enabled };
      applyMotionPreference(enabled);
      scene?.setReducedMotion(enabled);
      persistPreferences();
    },
    onOpenChange: (open) => {
      settingsOpen = open;
      syncRuntimePause();
    },
  });
  settings.setPreferences(preferences);

  syncRuntimePause();
}

bootstrap();
