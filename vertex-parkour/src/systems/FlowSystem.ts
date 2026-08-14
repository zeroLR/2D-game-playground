import type { GameState } from '../domain/gameState';

export const FLOW_MIN = 1;
export const FLOW_MAX = 12;
export const FLOW_GRACE_SECONDS = 1.35;
export const FLOW_DECAY_PER_SECOND = 0.9;
export const FLOW_GAIN_EPSILON = 0.05;

export type FlowTier = 'calm' | 'engaged' | 'rush' | 'overdrive';

export type FlowFrame = {
  state: GameState;
  tier: FlowTier;
  intensity: number;
  graceRemaining: number;
};

export function getFlowTier(flow: number): FlowTier {
  if (flow >= 9) return 'overdrive';
  if (flow >= 6) return 'rush';
  if (flow >= 3) return 'engaged';
  return 'calm';
}

export function getFlowIntensity(flow: number) {
  return Math.max(0, Math.min(1, (flow - FLOW_MIN) / (FLOW_MAX - FLOW_MIN)));
}

/**
 * Adds temporal meaning to the existing domain Flow gains.
 * Gameplay actions still decide how much Flow is earned; this system only
 * observes gains, maintains a short chaining grace period, and decays Flow
 * when the player stops connecting traversal actions.
 */
export class FlowSystem {
  private previousFlow = FLOW_MIN;
  private graceRemaining = 0;

  reset() {
    this.previousFlow = FLOW_MIN;
    this.graceRemaining = 0;
  }

  update(state: GameState, deltaSeconds: number): FlowFrame {
    const gainedFlow = state.flow > this.previousFlow + FLOW_GAIN_EPSILON;
    const lostFlow = state.flow < this.previousFlow - FLOW_GAIN_EPSILON;
    let decaySeconds = 0;

    if (gainedFlow) {
      this.graceRemaining = FLOW_GRACE_SECONDS;
    } else if (lostFlow) {
      // A mistake/reset should immediately end the current chain grace.
      this.graceRemaining = 0;
    } else {
      // A frame may cross the grace boundary. Only the portion of the frame
      // after grace has actually expired is eligible for Flow decay.
      const graceConsumed = Math.min(this.graceRemaining, deltaSeconds);
      this.graceRemaining = Math.max(0, this.graceRemaining - graceConsumed);
      decaySeconds = Math.max(0, deltaSeconds - graceConsumed);
    }

    let flow = state.flow;
    if (!gainedFlow && !lostFlow && decaySeconds > 0 && flow > FLOW_MIN) {
      flow = Math.max(FLOW_MIN, flow - FLOW_DECAY_PER_SECOND * decaySeconds);
    }

    this.previousFlow = flow;
    const nextState = flow === state.flow ? state : { ...state, flow };
    return {
      state: nextState,
      tier: getFlowTier(flow),
      intensity: getFlowIntensity(flow),
      graceRemaining: this.graceRemaining,
    };
  }
}
