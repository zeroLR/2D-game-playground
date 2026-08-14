import { Graphics } from 'pixi.js';
import { Palette } from './visuals';

export function redrawFlowBackdrop(
  view: Graphics,
  width: number,
  height: number,
  flowIntensity: number,
  transitionBoost: number,
) {
  view.clear();

  const highFlow = Math.max(0, (flowIntensity - 0.45) / 0.55);
  const strength = Math.min(1, highFlow * 0.55 + transitionBoost * 0.8);
  if (strength <= 0.01) return;

  // A restrained teal wash shifts the existing background palette without obscuring silhouettes.
  view.rect(0, 0, width, height * 0.32).fill({ color: 0x2b5d5d, alpha: 0.018 + strength * 0.055 });
  view.rect(0, height * 0.28, width, height * 0.42).fill({ color: Palette.teal, alpha: 0.008 + strength * 0.025 });
  view.rect(0, height * 0.62, width, height * 0.38).fill({ color: 0x163b3d, alpha: 0.014 + strength * 0.035 });
}
