import { Graphics } from 'pixi.js';
import { Palette } from './visuals';

const SURFACE_SEGMENTS = 24;
const BODY_DEPTH = 760;

function waveY(x: number, width: number, elapsed: number) {
  const phase = (x / width) * Math.PI * 2;
  return Math.sin(phase * 1.35 + elapsed * 1.55) * 4.2 + Math.sin(phase * 2.7 - elapsed * 1.05 + 0.8) * 1.8;
}

function traceSurface(view: Graphics, width: number, elapsed: number, offsetY = 0) {
  view.moveTo(0, waveY(0, width, elapsed) + offsetY);
  for (let i = 1; i <= SURFACE_SEGMENTS; i += 1) {
    const x = (width * i) / SURFACE_SEGMENTS;
    view.lineTo(x, waveY(x, width, elapsed) + offsetY);
  }
}

export function redrawAbyssLiquid(view: Graphics, width: number, elapsed: number) {
  view.clear();

  traceSurface(view, width, elapsed, 0);
  view.lineTo(width, BODY_DEPTH).lineTo(0, BODY_DEPTH).closePath().fill({ color: Palette.magentaDeep, alpha: 0.7 });

  traceSurface(view, width, elapsed * 0.93, 13);
  view.lineTo(width, BODY_DEPTH).lineTo(0, BODY_DEPTH).closePath().fill({ color: Palette.magenta, alpha: 0.13 });

  traceSurface(view, width, elapsed * 1.08, 30);
  view.lineTo(width, BODY_DEPTH).lineTo(0, BODY_DEPTH).closePath().fill({ color: 0x3f1830, alpha: 0.2 });

  traceSurface(view, width, elapsed, 3);
  view.stroke({ width: 8, color: Palette.magenta, alpha: 0.1 });
  traceSurface(view, width, elapsed, 0);
  view.stroke({ width: 1.5, color: 0xd86a8b, alpha: 0.62 });

  for (let i = 0; i < 9; i += 1) {
    const cycle = (elapsed * (7 + (i % 3) * 2) + i * 31) % 150;
    const y = 28 + cycle;
    const x = 18 + ((i * 47 + Math.sin(elapsed * 0.65 + i) * 11) % Math.max(1, width - 36));
    const radius = 0.8 + (i % 3) * 0.55;
    view.circle(x, y, radius).fill({ color: i % 3 === 0 ? 0xe79ab1 : Palette.magenta, alpha: 0.12 + (i % 2) * 0.07 });
  }

  for (let i = 0; i < 4; i += 1) {
    const x = ((i * 91 + elapsed * (5 + i)) % (width + 50)) - 25;
    const sampleX = Math.max(0, Math.min(width, x));
    const y = waveY(sampleX, width, elapsed) + 8 + i * 2;
    view.moveTo(x, y).lineTo(x + 18 + i * 3, y + Math.sin(elapsed + i) * 1.2).stroke({ width: 1, color: 0xe79ab1, alpha: 0.1 });
  }
}
