import type { BiomeId } from './Biome';

export type StormSurgePhase = 'calm' | 'warning' | 'active' | 'recovery';
export type StormSurgeFrame = {
  phase: StormSurgePhase;
  direction: -1 | 1;
  intensity: number;
  forceX: number;
};

const CALM = 2.6;
const WARNING = 0.9;
const ACTIVE = 1.15;
const RECOVERY = 1.35;
const CYCLE = CALM + WARNING + ACTIVE + RECOVERY;
const MAX_FORCE = 430;

export function stormSurgeFrame(elapsed: number, biome: BiomeId): StormSurgeFrame {
  if (biome !== 'storm-crown') return { phase: 'calm', direction: 1, intensity: 0, forceX: 0 };
  const cycleIndex = Math.floor(Math.max(0, elapsed) / CYCLE);
  const direction = (cycleIndex % 2 === 0 ? 1 : -1) as -1 | 1;
  const t = ((Math.max(0, elapsed) % CYCLE) + CYCLE) % CYCLE;
  if (t < CALM) return { phase: 'calm', direction, intensity: 0, forceX: 0 };
  if (t < CALM + WARNING) {
    const intensity = (t - CALM) / WARNING;
    return { phase: 'warning', direction, intensity, forceX: 0 };
  }
  if (t < CALM + WARNING + ACTIVE) {
    const p = (t - CALM - WARNING) / ACTIVE;
    const intensity = Math.sin(p * Math.PI) * 0.35 + 0.65;
    return { phase: 'active', direction, intensity, forceX: direction * MAX_FORCE * intensity };
  }
  const intensity = 1 - (t - CALM - WARNING - ACTIVE) / RECOVERY;
  return { phase: 'recovery', direction, intensity: Math.max(0, intensity), forceX: 0 };
}

export function applyStormSurgeVelocity(velocityX: number, frame: StormSurgeFrame, dt: number): number {
  if (frame.phase !== 'active' || dt <= 0) return velocityX;
  return Math.max(-620, Math.min(620, velocityX + frame.forceX * dt));
}
