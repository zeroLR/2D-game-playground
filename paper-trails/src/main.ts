import { Container } from 'pixi.js';
import { createRenderer } from './bootstrap/create-renderer';
import { createScaffoldScene } from './presentation/scaffold-scene';
import './style.css';

const hostElement = document.querySelector<HTMLElement>('#app');
if (!hostElement) throw new Error('[Paper Trails] Missing #app mount element');
const host: HTMLElement = hostElement;

function showBootstrapFailure(error: unknown): void {
  console.error('[Paper Trails] Application bootstrap failed.', error);
  host.dataset.bootstrapError = 'renderer';
  host.dataset.bootstrapState = 'failed';
  host.replaceChildren();

  const panel = document.createElement('section');
  panel.className = 'bootstrap-error';
  panel.setAttribute('role', 'alert');

  const title = document.createElement('strong');
  title.textContent = 'Unable to start Paper Trails';
  const detail = document.createElement('span');
  detail.textContent = 'The renderer could not be initialized. Reload the page or try another browser.';
  panel.append(title, detail);
  host.append(panel);
}

async function bootstrap(): Promise<void> {
  host.dataset.bootstrapState = 'starting';

  try {
    const app = await createRenderer(host);
    const sceneRoot = new Container();

    host.replaceChildren(app.canvas);
    app.canvas.classList.add('game-canvas');
    app.canvas.setAttribute('aria-label', 'Paper Trails scaffold renderer');
    app.stage.addChild(sceneRoot);

    const redraw = () => {
      const staleChildren = sceneRoot.removeChildren();
      for (const child of staleChildren) child.destroy({ children: true });
      sceneRoot.addChild(createScaffoldScene(app.screen.width, app.screen.height));
    };

    redraw();
    const resizeObserver = new ResizeObserver(() => {
      app.renderer.resize(Math.max(1, host.clientWidth), Math.max(1, host.clientHeight));
      redraw();
    });
    resizeObserver.observe(host);

    host.dataset.bootstrapState = 'ready';
    delete host.dataset.bootstrapError;
    console.info('[Paper Trails] Application bootstrap complete.');
  } catch (error) {
    showBootstrapFailure(error);
  }
}

void bootstrap();
