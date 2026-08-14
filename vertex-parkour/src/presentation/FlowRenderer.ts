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
  transitionBoost = 0,
) {
  view.clear();
  view.position.set(x, y);
  if (intensity <= 0.02 && transitionBoost <= 0.02) return;

  const pulse = 1 + Math.sin(elapsed * 5.2) * 0.04;
  const tierBoost = tier === 'overdrive' ? 1 : tier === 'rush' ? 0.72 : tier === 'engaged' ? 0.42 : 0.18;
  const alpha = (0.018 + intensity * 0.06) * tierBoost;
  const radius = (18 + intensity * 13) * pulse;

  // Keep the ambient aura soft; the high-tier transition should read through motion, not a shield-like ring.
  view.circle(0, -2, radius).fill({ color: Palette.teal, alpha });

  const highTier = tier === 'rush' || tier === 'overdrive';
  if (highTier || transitionBoost > 0.02) {
    const baseCount = tier === 'overdrive' ? 6 : tier === 'rush' ? 4 : 2;
    const streakCount = baseCount + Math.floor(transitionBoost * 6);
    for (let i = 0; i < streakCount; i += 1) {
      const phase = elapsed * (1.45 + i * 0.055) + i * 1.73;
      const spread = 11 + i * 2.6;
      const sx = Math.sin(phase) * spread;
      const sy = 8 + ((elapsed * (30 + i * 3.5) + i * 17) % 48);
      const length = 10 + intensity * 10 + transitionBoost * 24 + (i % 3) * 3;
      view.moveTo(sx, sy).lineTo(sx * 1.08, sy + length).stroke({
        width: 0.9 + transitionBoost * 0.65,
        color: Palette.tealSoft,
        alpha: 0.055 + intensity * 0.08 + transitionBoost * 0.09,
      });
    }
  }
}
