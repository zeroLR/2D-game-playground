import { createRenderer } from './bootstrap/create-renderer';
import { FixedStepLoop } from './game/FixedStepLoop';
import { DestructionScene } from './presentation/DestructionScene';
import './style.css';

const hostElement = document.querySelector<HTMLElement>('#app');
if (!hostElement) throw new Error('[Rune Ball] Missing #app mount element');
const host: HTMLElement = hostElement;

function showBootstrapFailure(error: unknown): void {
  console.error('[Rune Ball] Application bootstrap failed.', error);
  host.dataset.bootstrapError = 'renderer';
  host.dataset.bootstrapState = 'failed';
  host.setAttribute('aria-busy', 'false');
  host.replaceChildren();

  const panel = document.createElement('section');
  panel.className = 'bootstrap-error';
  panel.setAttribute('role', 'alert');

  const title = document.createElement('strong');
  title.textContent = 'Unable to start Rune Ball';
  const detail = document.createElement('span');
  detail.textContent = 'The renderer could not be initialized. Reload the page or try another browser.';
  panel.append(title, detail);
  host.append(panel);
}

async function bootstrap(): Promise<void> {
  host.dataset.bootstrapState = 'starting';
  console.info('[Rune Ball] Application bootstrap starting.');

  try {
    const app = await createRenderer(host);
    const scene = new DestructionScene(app.screen.width, app.screen.height);
    const loop = new FixedStepLoop(
      (dtSeconds) => scene.update(dtSeconds),
      (alpha) => scene.present(alpha),
    );

    host.replaceChildren(app.canvas);
    app.canvas.classList.add('game-canvas');
    app.canvas.setAttribute('aria-label', 'Rune Ball P2 destruction and combo playtest');
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
    console.info('[Rune Ball] P2 destruction + combo gate ready.');
  } catch (error) {
    showBootstrapFailure(error);
  }
}

void bootstrap();
