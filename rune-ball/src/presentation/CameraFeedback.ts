import type { Point2D } from '../input/SwipeClassifier';

export type CameraFeedbackTier = 'break' | 'chain' | 'overdrive-enter' | 'overdrive-exit';

interface CameraImpulse {
  direction: Point2D;
  amplitude: number;
  duration: number;
  life: number;
  phase: number;
}

const PROFILES: Record<CameraFeedbackTier, { amplitude: number; duration: number }> = {
  break: { amplitude: 1.9, duration: 0.12 },
  chain: { amplitude: 3.2, duration: 0.17 },
  'overdrive-enter': { amplitude: 6.0, duration: 0.30 },
  'overdrive-exit': { amplitude: 3.4, duration: 0.20 },
};

const MAX_IMPULSES = 6;
const MAX_OFFSET = 6;

export class CameraFeedback {
  private readonly impulses: CameraImpulse[] = [];
  private serial = 0;
  private reducedMotion = false;

  setReducedMotion(enabled: boolean): void {
    this.reducedMotion = enabled;
  }

  kick(tier: CameraFeedbackTier, origin?: Point2D, center?: Point2D): void {
    const profile = PROFILES[tier];
    const direction = this.resolveDirection(origin, center);
    const motionScale = this.reducedMotion ? 0.16 : 1;
    const impulse: CameraImpulse = {
      direction,
      amplitude: profile.amplitude * motionScale,
      duration: profile.duration,
      life: profile.duration,
      phase: this.serial * 2.399,
    };
    this.serial += 1;
    this.impulses.push(impulse);
    while (this.impulses.length > MAX_IMPULSES) this.impulses.shift();
  }

  update(dtSeconds: number): Point2D {
    const dt = Number.isFinite(dtSeconds) ? Math.max(0, dtSeconds) : 0;
    let x = 0;
    let y = 0;

    for (let index = this.impulses.length - 1; index >= 0; index -= 1) {
      const impulse = this.impulses[index];
      impulse.life = Math.max(0, impulse.life - dt);
      if (impulse.life <= 0) {
        this.impulses.splice(index, 1);
        continue;
      }

      const progress = 1 - impulse.life / impulse.duration;
      const envelope = Math.pow(1 - progress, 1.25);

      // One readable directional punch followed by a small recoil. This reads as
      // impact rather than continuous handheld shake while staying deterministic.
      const primary = Math.sin(progress * Math.PI * 1.75) * impulse.amplitude * envelope;
      const secondary = Math.sin(progress * Math.PI * 2.5 + impulse.phase) * impulse.amplitude * 0.16 * envelope;
      const perpendicular = { x: -impulse.direction.y, y: impulse.direction.x };
      x += impulse.direction.x * primary + perpendicular.x * secondary;
      y += impulse.direction.y * primary + perpendicular.y * secondary;
    }

    const length = Math.hypot(x, y);
    if (length > MAX_OFFSET) {
      x = x / length * MAX_OFFSET;
      y = y / length * MAX_OFFSET;
    }
    return { x, y };
  }

  private resolveDirection(origin?: Point2D, center?: Point2D): Point2D {
    if (origin && center) {
      const dx = center.x - origin.x;
      const dy = center.y - origin.y;
      const length = Math.hypot(dx, dy);
      if (length > 0.001) return { x: dx / length, y: dy / length };
    }

    const angle = this.serial * 2.399;
    return { x: Math.cos(angle), y: Math.sin(angle) };
  }
}
