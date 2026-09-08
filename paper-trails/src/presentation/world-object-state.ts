export type GateVisualState = 'sealed' | 'opening' | 'open';

export function gateVisualState(relicCollected: boolean, gateOpeningFrame: number | null): GateVisualState {
  if (!relicCollected) return 'sealed';
  return gateOpeningFrame === null ? 'open' : 'opening';
}

export function relicVisible(relicCollected: boolean): boolean {
  return !relicCollected;
}

export function relicAnimationFrame(tick: number): number {
  return Math.abs(tick) % 4;
}

export function gateOpeningProgress(frame: number | null, frameCount = 5): number {
  if (frame === null) return 1;
  if (frameCount <= 1) return 1;
  return Math.min(1, Math.max(0, frame / (frameCount - 1)));
}
