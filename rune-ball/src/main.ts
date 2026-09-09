import { AudioDirector } from './audio/AudioDirector';
import { createRenderer } from './bootstrap/create-renderer';
import { PreloadScreen } from './bootstrap/PreloadScreen';
import { FixedStepLoop } from './game/FixedStepLoop';
import { DestructionScene } from './presentation/DestructionScene';
import './style.css';

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
  console.info('[Rune Ball] P5.4 buffered SFX bootstrap starting.');

  const preloadScreen = new PreloadScreen(host);
  const audio = new AudioDirector();

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

    // Download + SFX decode are already complete here. The Enter gesture only
    // resumes AudioContext and starts BGM, keeping expensive work outside gameplay.
    await preloadScreen.waitForSuccessfulEnter(() => audio.unlock());

    const scene = new DestructionScene(app.screen.width, app.screen.height, audio);
    const loop = new FixedStepLoop(
      (dtSeconds) => scene.update(dtSeconds),
      (alpha) => scene.present(alpha),
    );

    host.replaceChildren(app.canvas);
    app.canvas.classList.add('game-canvas');
    app.canvas.setAttribute('aria-label', 'Rune Ball P5.4 buffered SFX playtest');
    app.stage.addChild(scene);

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
    console.info('[Rune Ball] P5.4 ready. SFX are decoded AudioBuffers before gameplay starts.');
  } catch (error) {
    showBootstrapFailure(
      error,
      'Required renderer or audio resources could not be prepared. Reload the page and try again.',
    );
  }
}

void bootstrap();
