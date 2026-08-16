import { createApplication } from './bootstrap';
import { GameRuntime, LOGICAL_H, LOGICAL_W } from './game/GameRuntime';
import { GameHub } from './hub/GameHub';
import './hub/hub.css';
import './hub/profile.css';

const AUTOSTART_KEY = 'vertex-autostart-run';

async function bootstrap() {
  const app = await createApplication(LOGICAL_W, LOGICAL_H);
  const host = document.querySelector<HTMLElement>('#app')!;
  host.appendChild(app.canvas);

  const runtime = new GameRuntime(app);
  runtime.start();
  app.ticker.stop();

  let activeRun = sessionStorage.getItem(AUTOSTART_KEY) === '1';
  sessionStorage.removeItem(AUTOSTART_KEY);

  const resumeGameplay = () => {
    activeRun = true;
    app.ticker.start();
  };

  const enterChapter = () => {
    if (activeRun) {
      sessionStorage.setItem(AUTOSTART_KEY, '1');
      window.location.reload();
      return;
    }
    resumeGameplay();
  };

  const hub = new GameHub(host, {
    onEnterChapter: enterChapter,
    onResumeRun: resumeGameplay,
    hasActiveRun: () => activeRun,
  });

  // The Hub owns the product shell while Pixi owns gameplay. Pausing the
  // application ticker guarantees that opening HOME freezes the run rather
  // than letting the world continue behind an opaque menu.
  new MutationObserver(() => {
    if (hub.root.hidden) app.ticker.start();
    else app.ticker.stop();
  }).observe(hub.root, { attributes: true, attributeFilter: ['hidden'] });

  if (activeRun) {
    hub.showGame();
    app.ticker.start();
  }
}

void bootstrap();
