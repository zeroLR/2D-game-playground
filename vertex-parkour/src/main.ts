import { createApplication } from './bootstrap';
import { GameRuntime, LOGICAL_H, LOGICAL_W } from './game/GameRuntime';

async function bootstrap() {
  const app = await createApplication(LOGICAL_W, LOGICAL_H);
  document.querySelector('#app')!.appendChild(app.canvas);
  new GameRuntime(app).start();
}

void bootstrap();
