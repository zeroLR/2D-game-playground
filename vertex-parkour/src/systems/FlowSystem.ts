import type { GameState } from '../domain/gameState';

export const FLOW_MIN = 1;
export const FLOW_MAX = 12;
export const FLOW_PERFECT = FLOW_MAX;
export const FLOW_ENGAGED_THRESHOLD = 3;
export const FLOW_RUSH_THRESHOLD = 6;
export const FLOW_OVERDRIVE_THRESHOLD = 9;
export const FLOW_GRACE_SECONDS = 1.35;
export const FLOW_UPGRADE_GRACE_BONUS = 0.45;
export const FLOW_DECAY_PER_SECOND = 0.9;
export const FLOW_GAIN_EPSILON = 0.05;

export type FlowTier = 'calm' | 'engaged' | 'rush' | 'overdrive';
export type FlowGameplayModifiers = {
  airControlMultiplier: number;
  landingRecoveryMultiplier: number;
};

export type FlowFrame = {
  state: GameState;
  tier: FlowTier;
  intensity: number;
  graceRemaining: number;
  enteredTier: 'rush' | 'overdrive' | null;
  perfect: boolean;
  enteredPerfect: boolean;
};

export function getFlowTier(flow: number): FlowTier {
  if (flow >= FLOW_OVERDRIVE_THRESHOLD) return 'overdrive';
  if (flow >= FLOW_RUSH_THRESHOLD) return 'rush';
  if (flow >= FLOW_ENGAGED_THRESHOLD) return 'engaged';
  return 'calm';
}

export function isPerfectFlow(flow: number) { return flow >= FLOW_PERFECT; }

export function getFlowGameplayModifiers(flow: number): FlowGameplayModifiers {
  switch (getFlowTier(flow)) {
    case 'calm': return { airControlMultiplier: 1, landingRecoveryMultiplier: 1 };
    case 'engaged': return { airControlMultiplier: 1.04, landingRecoveryMultiplier: 0.94 };
    case 'rush': return { airControlMultiplier: 1.08, landingRecoveryMultiplier: 0.86 };
    case 'overdrive': return { airControlMultiplier: 1.12, landingRecoveryMultiplier: 0.76 };
  }
}

export function getFlowIntensity(flow: number) {
  return Math.max(0, Math.min(1, (flow - FLOW_MIN) / (FLOW_MAX - FLOW_MIN)));
}

export function getFlowGraceSeconds(state: GameState) {
  return FLOW_GRACE_SECONDS + (state.flowUpgradeLevel + state.skills.continuity) * FLOW_UPGRADE_GRACE_BONUS;
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
  private previousPerfect = false;
  private graceRemaining = 0;

  reset() {
    this.previousFlow = FLOW_MIN;
    this.previousTier = 'calm';
    this.previousPerfect = false;
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

    let flow = Math.min(FLOW_MAX, Math.max(FLOW_MIN, state.flow));
    if (!gainedFlow && !lostFlow && decaySeconds > 0 && flow > FLOW_MIN) {
      flow = Math.max(FLOW_MIN, flow - FLOW_DECAY_PER_SECOND * decaySeconds);
    }

    const tier = getFlowTier(flow);
    const perfect = isPerfectFlow(flow);
    const enteredPerfect = perfect && !this.previousPerfect;
    const enteredTier = tierRank(tier) > tierRank(this.previousTier) && (tier === 'rush' || tier === 'overdrive') ? tier : null;

    this.previousFlow = flow;
    this.previousTier = tier;
    this.previousPerfect = perfect;
    const nextState = flow === state.flow ? state : { ...state, flow };
    return { state: nextState, tier, intensity: getFlowIntensity(flow), graceRemaining: this.graceRemaining, enteredTier, perfect, enteredPerfect };
  }
}
