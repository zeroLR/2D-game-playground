import type { BiomeId } from './Biome';

export type StormSurgePhase = 'calm' | 'warning' | 'active' | 'recovery';
export type StormSurgeFrame = {
  phase: StormSurgePhase;
  direction: -1 | 1;
  intensity: number;
  forceX: number;
};

const CALM = 3.4;
const WARNING = 1.2;
const ACTIVE = 3.5;
const RECOVERY = 2.0;
const CYCLE = CALM + WARNING + ACTIVE + RECOVERY;
// Movement drag is intentionally strong in normal traversal. Storm Crown needs
// to beat that drag for several seconds so the surge changes route choice rather
// than reading as a tiny impulse between jumps.
const MAX_FORCE = 3600;
const MAX_SURGE_VELOCITY = 720;

export function stormSurgeFrame(elapsed: number, biome: BiomeId): StormSurgeFrame {
  if (biome !== 'storm-crown') return { phase: 'calm', direction: 1, intensity: 0, forceX: 0 };
  const safeElapsed = Math.max(0, elapsed);
  const cycleIndex = Math.floor(safeElapsed / CYCLE);
  const direction = (cycleIndex % 2 === 0 ? 1 : -1) as -1 | 1;
  const t = safeElapsed % CYCLE;

  if (t < CALM) return { phase: 'calm', direction, intensity: 0, forceX: 0 };
  if (t < CALM + WARNING) {
    const intensity = (t - CALM) / WARNING;
    return { phase: 'warning', direction, intensity, forceX: 0 };
  }
  if (t < CALM + WARNING + ACTIVE) {
    const p = (t - CALM - WARNING) / ACTIVE;
    const rampIn = Math.min(1, p / 0.18);
    const rampOut = Math.min(1, (1 - p) / 0.18);
    const intensity = 0.72 + 0.28 * Math.min(rampIn, rampOut);
    return { phase: 'active', direction, intensity, forceX: direction * MAX_FORCE * intensity };
  }

  const intensity = 1 - (t - CALM - WARNING - ACTIVE) / RECOVERY;
  return { phase: 'recovery', direction, intensity: Math.max(0, intensity), forceX: 0 };
}

export function applyStormSurgeVelocity(velocityX: number, frame: StormSurgeFrame, dt: number): number {
  if (frame.phase !== 'active' || dt <= 0) return velocityX;
  return Math.max(-MAX_SURGE_VELOCITY, Math.min(MAX_SURGE_VELOCITY, velocityX + frame.forceX * dt));
}
