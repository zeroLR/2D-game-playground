import { Graphics } from 'pixi.js';
import type { FlowTier } from '../systems/FlowSystem';
import { Palette } from './visuals';

export function redrawFlowAura(
  view: Graphics,
  x: number,
  y: number,
  elapsed: number,
  intensity: number,
  tier: FlowTier,
) {
  view.clear();
  view.position.set(x, y);
  if (intensity <= 0.02) return;

  const pulse = 1 + Math.sin(elapsed * 5.2) * 0.04;
  const tierBoost = tier === 'overdrive' ? 1 : tier === 'rush' ? 0.72 : tier === 'engaged' ? 0.42 : 0.18;
  const alpha = (0.025 + intensity * 0.08) * tierBoost;
  const radius = (20 + intensity * 16) * pulse;

  view.circle(0, -2, radius).fill({ color: Palette.teal, alpha });
  view.circle(0, -2, radius + 5).stroke({ width: 1, color: Palette.tealSoft, alpha: alpha * 0.8 });

  if (tier === 'rush' || tier === 'overdrive') {
    const streakCount = tier === 'overdrive' ? 6 : 3;
    for (let i = 0; i < streakCount; i += 1) {
      const phase = elapsed * (1.4 + i * 0.07) + i * 1.73;
      const sx = Math.sin(phase) * (13 + i * 3.2);
      const sy = 7 + ((elapsed * (28 + i * 4) + i * 19) % 42);
      view.moveTo(sx, sy).lineTo(sx * 1.15, sy + 10 + intensity * 8).stroke({
        width: tier === 'overdrive' ? 1.3 : 1,
        color: Palette.tealSoft,
        alpha: 0.07 + intensity * 0.09,
      });
    }
  }
}
