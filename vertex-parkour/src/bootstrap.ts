import { Application } from 'pixi.js';

export async function createApplication(width: number, height: number) {
  const app = new Application();
  await app.init({
    width,
    height,
    background: '#10262a',
    antialias: true,
    resolution: Math.min(devicePixelRatio, 2),
    autoDensity: true,
  });
  return app;
}
