import { createRenderer } from './bootstrap/create-renderer';
import { PixelBoardScene } from './presentation/pixel-board-scene';
import { preloadPixelArt } from './presentation/pixel-art';
import './style.css';

const hostElement = document.querySelector<HTMLElement>('#app');
if (!hostElement) throw new Error('[Paper Trails] Missing #app mount element');
const host: HTMLElement = hostElement;

function showBootstrapFailure(error: unknown): void {
  console.error('[Paper Trails] Application bootstrap failed.', error);
  host.dataset.bootstrapError = 'renderer-or-assets';
  host.dataset.bootstrapState = 'failed';
  host.replaceChildren();

  const panel = document.createElement('section');
  panel.className = 'bootstrap-error';
  panel.setAttribute('role', 'alert');

  const title = document.createElement('strong');
  title.textContent = 'Unable to start Paper Trails';
  const detail = document.createElement('span');
  detail.textContent = 'The renderer or pixel-art assets could not be initialized. Reload the page or try another browser.';
  panel.append(title, detail);
  host.append(panel);
}

async function bootstrap(): Promise<void> {
  host.dataset.bootstrapState = 'starting';

  try {
    const app = await createRenderer(host);
    await preloadPixelArt();
    const scene = new PixelBoardScene(app.screen.width, app.screen.height);

    host.replaceChildren(app.canvas);
    app.canvas.classList.add('game-canvas');
    app.canvas.setAttribute('aria-label', 'Paper Trails P4.1 mechanic-legibility page board');
    app.stage.addChild(scene);

    const resizeObserver = new ResizeObserver(() => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      app.renderer.resize(width, height);
      scene.setViewport(width, height);
    });
    resizeObserver.observe(host);

    host.dataset.bootstrapState = 'ready';
    delete host.dataset.bootstrapError;
    console.info('[Paper Trails] P4.1 mechanic-legibility board ready.');
  } catch (error) {
    showBootstrapFailure(error);
  }
}

void bootstrap();
