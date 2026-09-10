import { AudioDirector } from './audio/AudioDirector';
import { createRenderer } from './bootstrap/create-renderer';
import { PreloadScreen } from './bootstrap/PreloadScreen';
import type { DestructionEvent } from './game/DestructionSession';
import { FixedStepLoop } from './game/FixedStepLoop';
import { SessionDirector } from './game/SessionDirector';
import { DestructionScene } from './presentation/DestructionScene';
import { SessionChrome } from './presentation/SessionChrome';
import './style.css';
import './session.css';

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

async function bootstrap(): Promise<void> {
  host.dataset.bootstrapState = 'starting';
  host.setAttribute('aria-busy', 'true');
  console.info('[Rune Ball] P6.1 session-loop bootstrap starting.');

  const preloadScreen = new PreloadScreen(host);
  const audio = new AudioDirector();
  let setRuntimePaused: ((paused: boolean) => void) | null = null;

  const syncAppVisibility = (): void => {
    const hidden = document.visibilityState === 'hidden';
    if (hidden) audio.pauseForBackground();
    else audio.resumeFromBackground();
    setRuntimePaused?.(hidden);
  };
  const handlePageHide = (): void => {
    audio.pauseForBackground();
    setRuntimePaused?.(true);
  };
  const handlePageShow = (): void => {
    if (document.visibilityState !== 'visible') return;
    audio.resumeFromBackground();
    setRuntimePaused?.(false);
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

    if (!audioReady) {
      throw new Error('Required runtime audio could not be preloaded and decoded.');
    }

    preloadScreen.setReady();
    host.dataset.bootstrapState = 'awaiting-entry';
    host.setAttribute('aria-busy', 'false');
    await preloadScreen.waitForSuccessfulEnter(() => audio.unlock());

    const session = new SessionDirector({ totalSeconds: 75, finalReleaseSeconds: 3 });
    let scene: DestructionScene;
    let chrome: SessionChrome;
    let resultHandled = false;

    const onGameplayEvent = (event: DestructionEvent): void => {
      session.registerEvent(event);
    };

    const onPlayerAction = (): void => {
      if (session.start()) chrome.render(session.snapshot);
    };

    const createScene = (): DestructionScene => new DestructionScene(
      app.screen.width,
      app.screen.height,
      audio,
      { onPlayerAction, onGameplayEvent },
    );

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
          audio.playResultSting();
          chrome.render(session.snapshot);
        }
      },
      (alpha) => scene.present(alpha),
    );

    host.replaceChildren(app.canvas);
    app.canvas.classList.add('game-canvas');
    app.canvas.setAttribute('aria-label', 'Rune Ball P6.1 session loop playtest');
    app.stage.addChild(scene);

    const restartRun = (): void => {
      app.stage.removeChild(scene);
      scene.destroy({ children: true });
      session.reset();
      loop.reset();
      resultHandled = false;
      scene = createScene();
      app.stage.addChild(scene);
      chrome.render(session.snapshot);
    };

    chrome = new SessionChrome(host, restartRun);
    chrome.render(session.snapshot);

    setRuntimePaused = (paused: boolean): void => {
      session.setPaused(paused);
      if (!paused) loop.reset();
    };

    app.ticker.add((ticker) => {
      loop.tick(ticker.deltaMS);
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
    console.info('[Rune Ball] P6.1 ready. First valid action starts the authored 75-second run.');
  } catch (error) {
    showBootstrapFailure(
      error,
      'Required renderer or audio resources could not be prepared. Reload the page and try again.',
    );
  }
}

void bootstrap();
