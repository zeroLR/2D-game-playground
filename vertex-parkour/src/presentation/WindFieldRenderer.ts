import { Graphics } from 'pixi.js';
import type { WindField } from '../world/WindField';

function wrap(value: number, min: number, max: number) {
  const span = max - min;
  return ((value - min) % span + span) % span + min;
}

export function createWindFieldVisual(field: WindField): Graphics {
  const g = new Graphics();
  updateWindFieldVisual(g, field, 0);
  return g;
}

export function updateWindFieldVisual(g: Graphics, field: WindField, elapsed: number) {
  g.clear();
  const direction = Math.sign(field.forceX) || 1;
  const width = field.halfWidth * 2;
  const height = field.halfHeight * 2;

  // A very light atmospheric body marks the corridor without looking like a HUD zone.
  g.rect(-field.halfWidth, -field.halfHeight, width, height).fill({ color: 0xdff8ff, alpha: 0.018 });

  for (let row = 0; row < 7; row += 1) {
    const y = -field.halfHeight + 15 + row * ((height - 30) / 6);
    const speed = 62 + row * 9;
    const offset = elapsed * speed * direction + row * 47;
    const start = wrap(offset, -field.halfWidth - 80, field.halfWidth + 80);
    const x0 = direction > 0 ? start - field.halfWidth : field.halfWidth - start;
    const length = 58 + (row % 3) * 19;
    const x1 = x0 + direction * length;
    g.moveTo(x0, y).lineTo(x1, y + (row % 2 === 0 ? -3 : 3)).stroke({ width: row % 3 === 0 ? 2 : 1, color: 0xe8fbff, alpha: 0.12 + (row % 2) * 0.035 });
  }

  for (let i = 0; i < 9; i += 1) {
    const drift = elapsed * (42 + (i % 4) * 11) * direction + i * 39;
    const x = direction > 0
      ? wrap(drift, -field.halfWidth, field.halfWidth)
      : -wrap(drift, -field.halfWidth, field.halfWidth);
    const y = -field.halfHeight + 12 + ((i * 29) % Math.max(20, height - 24));
    g.circle(x, y, i % 3 === 0 ? 1.7 : 1.1).fill({ color: 0xf2fdff, alpha: 0.17 });
  }
}
