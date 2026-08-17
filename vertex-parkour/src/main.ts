import { createApplication } from './bootstrap';
import { GameRuntime, LOGICAL_H, LOGICAL_W } from './game/GameRuntime';
import { ChapterTransition } from './hub/ChapterTransition';
import { GameHub } from './hub/GameHub';
import './hub/hub.css';
import './hub/profile.css';
import './hub/transition.css';

const AUTOSTART_KEY = 'vertex-autostart-run';
const ENTRY_TRANSITION_KEY = 'vertex-entry-transition';

async function bootstrap() {
  const app = await createApplication(LOGICAL_W, LOGICAL_H);
  const host = document.querySelector<HTMLElement>('#app')!;
  host.appendChild(app.canvas);

  let activeRun = sessionStorage.getItem(AUTOSTART_KEY) === '1';
  const shouldPlayReloadEntry = sessionStorage.getItem(ENTRY_TRANSITION_KEY) === '1';
  sessionStorage.removeItem(AUTOSTART_KEY);
  sessionStorage.removeItem(ENTRY_TRANSITION_KEY);

  let clearHandled = false;
  let hub!: GameHub;
  const transition = new ChapterTransition(host, { reducedMotion: () => document.documentElement.classList.contains('vertex-reduced-motion') });

  const runtime = new GameRuntime(app, {
    onChapterClear: async ({ score, elapsed }) => {
      if (clearHandled) return;
      clearHandled = true;
      activeRun = false;
      app.ticker.stop();
      await transition.playClear(score, elapsed);
      hub.showHub('home');
    },
  });
  runtime.start();
  app.ticker.stop();

  const resumeGameplay = () => { activeRun = true; app.ticker.start(); };
  const enterChapter = async () => {
    if (activeRun) {
      sessionStorage.setItem(AUTOSTART_KEY, '1');
      sessionStorage.setItem(ENTRY_TRANSITION_KEY, '1');
      window.location.reload();
      return;
    }
    activeRun = true;
    clearHandled = false;
    app.ticker.stop();
    await transition.playEntry();
    app.ticker.start();
  };

  hub = new GameHub(host, { onEnterChapter: () => { void enterChapter(); }, onResumeRun: resumeGameplay, hasActiveRun: () => activeRun });

  new MutationObserver(() => {
    if (hub.root.hidden && transition.root.hidden) app.ticker.start();
    else app.ticker.stop();
  }).observe(hub.root, { attributes: true, attributeFilter: ['hidden'] });

  if (activeRun) {
    hub.showGame();
    if (shouldPlayReloadEntry) { app.ticker.stop(); await transition.playEntry(); }
    app.ticker.start();
  }
}

void bootstrap();
