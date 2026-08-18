import { Application } from 'pixi.js';
import { Game } from './game/Game';

async function bootstrap() {
  const app = new Application();
  await app.init({ width: 360, height: 640, background: '#08101b', antialias: false });
  document.querySelector('#app')!.appendChild(app.canvas);
  app.canvas.style.touchAction = 'none';
  new Game(app);
}

void bootstrap();
