import { Graphics } from 'pixi.js';
import type { WindField } from '../world/WindField';

export function createWindFieldVisual(field: WindField): Graphics {
  const g = new Graphics();
  const direction = Math.sign(field.forceX) || 1;
  const span = Math.min(106, field.halfWidth * 1.3);
  const startX = direction > 0 ? -span / 2 : span / 2;

  for (let row = 0; row < 4; row += 1) {
    const y = -42 + row * 21;
    const length = 34 + (row % 2) * 16;
    const x0 = startX + (row % 2 === 0 ? 0 : -direction * 12);
    const x1 = x0 + direction * length;
    g.moveTo(x0, y).lineTo(x1, y + (row % 2 === 0 ? -2 : 2)).stroke({ width: 1, color: 0xd9f7ff, alpha: 0.22 });
    g.moveTo(x1 - direction * 6, y - 4).lineTo(x1, y).lineTo(x1 - direction * 6, y + 4).stroke({ width: 1, color: 0xeafcff, alpha: 0.26 });
  }

  g.position.set(0, -52);
  return g;
}
