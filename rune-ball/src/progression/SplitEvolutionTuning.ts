import type { Point2D } from '../input/SwipeClassifier';
import type { SplitEvolutionPath, SplitEvolutionStage } from './RuneEvolutionCatalog';

export interface SplitEchoOffset {
  forward: number;
  lateral: number;
}

export interface SplitCastProfile {
  durationSeconds: number;
  hitRadius: number;
  offsets: readonly SplitEchoOffset[];
}

export const BASE_SPLIT_PROFILE: SplitCastProfile = {
  durationSeconds: 1.25,
  hitRadius: 13,
  offsets: [
    { forward: 0, lateral: 42 },
    { forward: 0, lateral: -42 },
  ],
};

export function getSplitCastProfile(
  path: SplitEvolutionPath,
  stage: SplitEvolutionStage,
): SplitCastProfile {
  if (stage === 0) return BASE_SPLIT_PROFILE;

  if (path === 'prism') {
    if (stage === 1) {
      return {
        durationSeconds: 1.35,
        hitRadius: 13,
        offsets: [
          { forward: 14, lateral: 42 },
          { forward: 14, lateral: -42 },
          { forward: -6, lateral: 78 },
          { forward: -6, lateral: -78 },
        ],
      };
    }
    return {
      durationSeconds: 1.5,
      hitRadius: 13,
      offsets: [
        { forward: 22, lateral: 36 },
        { forward: 22, lateral: -36 },
        { forward: 8, lateral: 70 },
        { forward: 8, lateral: -70 },
        { forward: -10, lateral: 104 },
        { forward: -10, lateral: -104 },
      ],
    };
  }

  if (stage === 1) {
    return {
      durationSeconds: 1.6,
      hitRadius: 13,
      offsets: [
        { forward: 42, lateral: 12 },
        { forward: 78, lateral: -12 },
      ],
    };
  }

  return {
    durationSeconds: 1.85,
    hitRadius: 13,
    offsets: [
      { forward: 34, lateral: 10 },
      { forward: 72, lateral: 0 },
      { forward: 112, lateral: -10 },
    ],
  };
}

export function projectSplitEchoes(
  position: Point2D,
  velocity: Point2D,
  profile: SplitCastProfile,
): Point2D[] {
  const speed = Math.hypot(velocity.x, velocity.y);
  if (!(speed > 0)) return [];
  const forward = { x: velocity.x / speed, y: velocity.y / speed };
  const normal = { x: -forward.y, y: forward.x };
  return profile.offsets.map((offset) => ({
    x: position.x + forward.x * offset.forward + normal.x * offset.lateral,
    y: position.y + forward.y * offset.forward + normal.y * offset.lateral,
  }));
}
