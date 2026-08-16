export type NovaAnimationState = 'idle' | 'jump' | 'fall' | 'dash-left' | 'dash-right';

export type NovaAnimationInput = {
  velocityY: number;
  dashDirection: -1 | 0 | 1;
  dashVisualTime: number;
};

const AIRBORNE_THRESHOLD = 32;

/**
 * Presentation-only animation state selection.
 *
 * Dash has priority because MovementSystem already exposes a short-lived
 * dashVisualTime contract. Outside that window, vertical velocity decides
 * between jump/fall and a small dead-zone prevents idle frames from flickering
 * near the apex of a jump.
 */
export function resolveNovaAnimationState(input: NovaAnimationInput): NovaAnimationState {
  if (input.dashVisualTime > 0 && input.dashDirection !== 0) {
    return input.dashDirection > 0 ? 'dash-right' : 'dash-left';
  }
  if (input.velocityY < -AIRBORNE_THRESHOLD) return 'jump';
  if (input.velocityY > AIRBORNE_THRESHOLD) return 'fall';
  return 'idle';
}
