import { Container, Graphics } from 'pixi.js';
import { Palette } from './visuals';

export function createPulseGateVisual(height: number): Container {
  const root = new Container();
  const beam = new Graphics();
  beam.label = 'pulse-beam';
  const capTop = new Graphics();
  const capBottom = new Graphics();
  capTop.roundRect(-15, -height / 2 - 7, 30, 10, 4).fill({ color: 0x273d40, alpha: 0.96 });
  capBottom.roundRect(-15, height / 2 - 3, 30, 10, 4).fill({ color: 0x273d40, alpha: 0.96 });
  root.addChild(beam, capTop, capBottom);
  updatePulseGateVisual(root, false, 0);
  return root;
}

export function updatePulseGateVisual(root: Container, active: boolean, elapsed: number) {
  const beam = root.getChildByLabel('pulse-beam') as Graphics | null;
  if (!beam) return;
  beam.clear();
  const height = Math.max(70, root.getBounds().height - 14);
  if (active) {
    const pulse = 0.62 + Math.sin(elapsed * 10) * 0.12;
    beam.rect(-12, -height / 2, 24, height).fill({ color: Palette.magentaDeep, alpha: 0.12 });
    beam.rect(-3, -height / 2, 6, height).fill({ color: 0xf16c78, alpha: pulse });
    beam.rect(-1, -height / 2, 2, height).fill({ color: Palette.cream, alpha: 0.72 });
  } else {
    beam.rect(-1, -height / 2, 2, height).fill({ color: Palette.magenta, alpha: 0.12 });
  }
}

export function createInterceptorVisual(): Container {
  const root = new Container();
  const body = new Graphics();
  body.circle(0, 0, 22).fill({ color: Palette.magenta, alpha: 0.035 });
  body.poly([-18, 0, -8, -10, 9, -7, 19, 0, 9, 7, -8, 10]).fill({ color: 0x25373a, alpha: 0.98 });
  body.poly([-18, 0, -28, -7, -23, 5]).fill({ color: Palette.magenta, alpha: 0.8 });
  body.poly([19, 0, 28, -7, 23, 5]).fill({ color: Palette.magenta, alpha: 0.8 });
  body.circle(0, 0, 5).fill({ color: 0xf16c78, alpha: 0.9 });
  body.circle(0, 0, 2).fill(Palette.cream);
  root.addChild(body);
  return root;
}
