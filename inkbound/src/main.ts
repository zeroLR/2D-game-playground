import { Application, Container } from 'pixi.js';
import { GameShell } from './GameShell';
import { LOGICAL_HEIGHT, LOGICAL_WIDTH, fitPortraitViewport } from './layout';

async function bootstrap() {
  const app = new Application();
  await app.init({
    width: LOGICAL_WIDTH,
    height: LOGICAL_HEIGHT,
    background: '#171714',
    antialias: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  });

  document.querySelector<HTMLDivElement>('#app')!.appendChild(app.canvas);

  const stage = new Container();
  const game = new GameShell();
  stage.addChild(game);
  app.stage.addChild(stage);

  function resize() {
    const fitted = fitPortraitViewport(window.innerWidth, window.innerHeight);
    app.canvas.style.width = `${fitted.width}px`;
    app.canvas.style.height = `${fitted.height}px`;
  }

  window.addEventListener('resize', resize);
  resize();

  app.ticker.add((ticker) => game.update(ticker.deltaMS / 1000));
}

void bootstrap();
