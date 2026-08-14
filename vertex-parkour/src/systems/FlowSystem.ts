import type { GameState } from '../domain/gameState';

export const FLOW_MIN = 1;
export const FLOW_MAX = 12;
export const FLOW_GRACE_SECONDS = 1.35;
export const FLOW_UPGRADE_GRACE_BONUS = 0.45;
export const FLOW_DECAY_PER_SECOND = 0.9;
export const FLOW_GAIN_EPSILON = 0.05;

export type FlowTier = 'calm' | 'engaged' | 'rush' | 'overdrive';

export type FlowFrame = {
  state: GameState;
  tier: FlowTier;
  intensity: number;
  graceRemaining: number;
  enteredTier: 'rush' | 'overdrive' | null;
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

export function getFlowGraceSeconds(state: GameState) {
  return FLOW_GRACE_SECONDS + state.flowUpgradeLevel * FLOW_UPGRADE_GRACE_BONUS;
}

function tierRank(tier: FlowTier) {
  switch (tier) {
    case 'calm': return 0;
    case 'engaged': return 1;
    case 'rush': return 2;
    case 'overdrive': return 3;
  }
}

export class FlowSystem {
  private previousFlow = FLOW_MIN;
  private previousTier: FlowTier = 'calm';
  private graceRemaining = 0;

  reset() {
    this.previousFlow = FLOW_MIN;
    this.previousTier = 'calm';
    this.graceRemaining = 0;
  }

  update(state: GameState, deltaSeconds: number): FlowFrame {
    const gainedFlow = state.flow > this.previousFlow + FLOW_GAIN_EPSILON;
    const lostFlow = state.flow < this.previousFlow - FLOW_GAIN_EPSILON;
    let decaySeconds = 0;

    if (gainedFlow) {
      this.graceRemaining = getFlowGraceSeconds(state);
    } else if (lostFlow) {
      this.graceRemaining = 0;
    } else {
      const graceConsumed = Math.min(this.graceRemaining, deltaSeconds);
      this.graceRemaining = Math.max(0, this.graceRemaining - graceConsumed);
      decaySeconds = Math.max(0, deltaSeconds - graceConsumed);
    }

    let flow = state.flow;
    if (!gainedFlow && !lostFlow && decaySeconds > 0 && flow > FLOW_MIN) {
      flow = Math.max(FLOW_MIN, flow - FLOW_DECAY_PER_SECOND * decaySeconds);
    }

    const tier = getFlowTier(flow);
    const enteredTier = tierRank(tier) > tierRank(this.previousTier) && (tier === 'rush' || tier === 'overdrive') ? tier : null;

    this.previousFlow = flow;
    this.previousTier = tier;
    const nextState = flow === state.flow ? state : { ...state, flow };
    return { state: nextState, tier, intensity: getFlowIntensity(flow), graceRemaining: this.graceRemaining, enteredTier };
  }
}
