import { Container, Graphics } from 'pixi.js';
import type { BiomeId } from '../world/Biome';
import { Palette } from './visuals';

export function createPulseGateVisual(height: number, biome: BiomeId = 'teal-ruins'): Container {
  const root = new Container();
  root.label = biome === 'violet-zone' ? 'violet-phase-gate' : 'pulse-gate';
  const beam = new Graphics();
  beam.label = 'pulse-beam';
  const capTop = new Graphics();
  const capBottom = new Graphics();
  const violet = biome === 'violet-zone';
  if (violet) {
    capTop.poly([-18, -height / 2 - 3, -8, -height / 2 - 10, 11, -height / 2 - 7, 18, -height / 2 - 1, 8, -height / 2 + 3, -11, -height / 2 + 1]).fill({ color: 0x28253f, alpha: 0.97 });
    capBottom.poly([-17, height / 2 + 2, -8, height / 2 - 4, 12, height / 2 - 1, 17, height / 2 + 5, 6, height / 2 + 8, -10, height / 2 + 6]).fill({ color: 0x28253f, alpha: 0.97 });
  } else {
    capTop.roundRect(-15, -height / 2 - 7, 30, 10, 4).fill({ color: 0x273d40, alpha: 0.96 });
    capBottom.roundRect(-15, height / 2 - 3, 30, 10, 4).fill({ color: 0x273d40, alpha: 0.96 });
  }
  root.addChild(beam, capTop, capBottom);
  updatePulseGateVisual(root, false, 0, biome);
  return root;
}

export function updatePulseGateVisual(root: Container, active: boolean, elapsed: number, biome: BiomeId = 'teal-ruins') {
  const beam = root.getChildByLabel('pulse-beam') as Graphics | null;
  if (!beam) return;
  beam.clear();
  const height = Math.max(70, root.getBounds().height - 14);
  const violet = biome === 'violet-zone';
  if (active) {
    const pulse = 0.62 + Math.sin(elapsed * (violet ? 13 : 10)) * 0.12;
    beam.rect(violet ? -16 : -12, -height / 2, violet ? 32 : 24, height).fill({ color: violet ? 0x493d82 : Palette.magentaDeep, alpha: violet ? 0.1 : 0.12 });
    if (violet) {
      beam.moveTo(-4, -height / 2).lineTo(3, height / 2).stroke({ width: 4, color: 0xa888ff, alpha: pulse });
      beam.moveTo(4, -height / 2).lineTo(-2, height / 2).stroke({ width: 1.5, color: 0xeee7ff, alpha: 0.55 });
    } else {
      beam.rect(-3, -height / 2, 6, height).fill({ color: 0xf16c78, alpha: pulse });
      beam.rect(-1, -height / 2, 2, height).fill({ color: Palette.cream, alpha: 0.72 });
    }
  } else {
    beam.rect(-1, -height / 2, 2, height).fill({ color: violet ? 0x9d85eb : Palette.magenta, alpha: violet ? 0.16 : 0.12 });
  }
}

export function createInterceptorVisual(biome: BiomeId = 'teal-ruins'): Container {
  const root = new Container();
  const body = new Graphics();
  const violet = biome === 'violet-zone';
  if (violet) {
    body.circle(0, 0, 24).fill({ color: 0xa888ff, alpha: 0.045 });
    body.poly([-20, 0, -7, -13, 4, -7, 17, -11, 12, 0, 19, 8, 3, 6, -7, 13]).fill({ color: 0x211f35, alpha: 0.99 });
    body.poly([-19, -1, -31, -10, -25, 5]).fill({ color: 0x9f7cff, alpha: 0.78 });
    body.poly([15, -5, 29, -12, 23, 4]).fill({ color: 0x705bc0, alpha: 0.7 });
    body.circle(1, 0, 5).fill({ color: 0xb58cff, alpha: 0.92 });
    body.circle(1, 0, 2).fill(0xf4efff);
  } else {
    body.circle(0, 0, 22).fill({ color: Palette.magenta, alpha: 0.035 });
    body.poly([-18, 0, -8, -10, 9, -7, 19, 0, 9, 7, -8, 10]).fill({ color: 0x25373a, alpha: 0.98 });
    body.poly([-18, 0, -28, -7, -23, 5]).fill({ color: Palette.magenta, alpha: 0.8 });
    body.poly([19, 0, 28, -7, 23, 5]).fill({ color: Palette.magenta, alpha: 0.8 });
    body.circle(0, 0, 5).fill({ color: 0xf16c78, alpha: 0.9 });
    body.circle(0, 0, 2).fill(Palette.cream);
  }
  root.addChild(body);
  return root;
}
