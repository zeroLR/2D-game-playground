import { describe, expect, it } from 'vitest';
import { createInitialState } from '../src/domain/gameState';
import {
  FLOW_DECAY_PER_SECOND,
  FLOW_GRACE_SECONDS,
  FLOW_UPGRADE_GRACE_BONUS,
  FlowSystem,
  getFlowGameplayModifiers,
  getFlowGraceSeconds,
  getFlowIntensity,
  getFlowTier,
  isPerfectFlow,
} from '../src/systems/FlowSystem';

describe('FlowSystem', () => {
  it('maps Flow into readable tiers', () => {
    expect(getFlowTier(1)).toBe('calm');
    expect(getFlowTier(3)).toBe('engaged');
    expect(getFlowTier(6)).toBe('rush');
    expect(getFlowTier(9)).toBe('overdrive');
  });

  it('gives higher tiers stronger control without changing jump power', () => {
    expect(getFlowGameplayModifiers(1)).toEqual({ airControlMultiplier: 1, landingRecoveryMultiplier: 1 });
    expect(getFlowGameplayModifiers(6).airControlMultiplier).toBeCloseTo(1.08);
    expect(getFlowGameplayModifiers(9).airControlMultiplier).toBeCloseTo(1.12);
    expect(getFlowGameplayModifiers(9).landingRecoveryMultiplier).toBeLessThan(getFlowGameplayModifiers(3).landingRecoveryMultiplier);
  });

  it('treats 12 as the explicit Perfect Flow ceiling', () => {
    expect(isPerfectFlow(11.99)).toBe(false);
    expect(isPerfectFlow(12)).toBe(true);
    const system = new FlowSystem();
    const frame = system.update({ ...createInitialState(), flow: 14 }, 0.016);
    expect(frame.state.flow).toBe(12);
    expect(frame.perfect).toBe(true);
    expect(frame.enteredPerfect).toBe(true);
  });

  it('only reports entering Perfect Flow once until it is lost', () => {
    const system = new FlowSystem();
    let frame = system.update({ ...createInitialState(), flow: 12 }, 0.016);
    expect(frame.enteredPerfect).toBe(true);
    frame = system.update(frame.state, 0.016);
    expect(frame.enteredPerfect).toBe(false);
    frame = system.update({ ...frame.state, flow: 10 }, 0.016);
    expect(frame.perfect).toBe(false);
    frame = system.update({ ...frame.state, flow: 12 }, 0.016);
    expect(frame.enteredPerfect).toBe(true);
  });

  it('normalizes visual intensity across the Flow range', () => {
    expect(getFlowIntensity(1)).toBe(0);
    expect(getFlowIntensity(12)).toBe(1);
    expect(getFlowIntensity(20)).toBe(1);
  });

  it('extends chain grace after choosing the Flow route', () => {
    const state = { ...createInitialState(), flowUpgradeLevel: 1 };
    expect(getFlowGraceSeconds(state)).toBeCloseTo(FLOW_GRACE_SECONDS + FLOW_UPGRADE_GRACE_BONUS);
    const system = new FlowSystem();
    const frame = system.update({ ...state, flow: 2.4 }, 0.016);
    expect(frame.graceRemaining).toBeCloseTo(FLOW_GRACE_SECONDS + FLOW_UPGRADE_GRACE_BONUS);
  });

  it('starts a grace window when gameplay awards Flow', () => {
    const system = new FlowSystem();
    const state = { ...createInitialState(), flow: 2.4 };
    const frame = system.update(state, 0.016);
    expect(frame.graceRemaining).toBe(FLOW_GRACE_SECONDS);
    expect(frame.state.flow).toBe(2.4);
  });

  it('holds Flow during the chain grace window', () => {
    const system = new FlowSystem();
    let state = { ...createInitialState(), flow: 4 };
    state = system.update(state, 0.016).state;
    const frame = system.update(state, FLOW_GRACE_SECONDS * 0.5);
    expect(frame.state.flow).toBe(4);
    expect(frame.graceRemaining).toBeGreaterThan(0);
  });

  it('decays Flow after the chain expires', () => {
    const system = new FlowSystem();
    let state = { ...createInitialState(), flow: 4 };
    state = system.update(state, 0.016).state;
    state = system.update(state, FLOW_GRACE_SECONDS).state;
    const frame = system.update(state, 1);
    expect(frame.state.flow).toBeCloseTo(4 - FLOW_DECAY_PER_SECOND);
  });

  it('only decays the portion of a frame beyond the grace boundary', () => {
    const system = new FlowSystem();
    let state = { ...createInitialState(), flow: 4 };
    state = system.update(state, 0.016).state;
    const overflow = 0.4;
    const frame = system.update(state, FLOW_GRACE_SECONDS + overflow);
    expect(frame.state.flow).toBeCloseTo(4 - FLOW_DECAY_PER_SECOND * overflow);
    expect(frame.graceRemaining).toBe(0);
  });

  it('never decays below the baseline', () => {
    const system = new FlowSystem();
    let state = { ...createInitialState(), flow: 1.2 };
    state = system.update(state, 0.016).state;
    state = system.update(state, FLOW_GRACE_SECONDS).state;
    const frame = system.update(state, 20);
    expect(frame.state.flow).toBe(1);
  });

  it('ends grace immediately when a mistake resets Flow', () => {
    const system = new FlowSystem();
    let state = { ...createInitialState(), flow: 7 };
    state = system.update(state, 0.016).state;
    const frame = system.update({ ...state, flow: 1 }, 0.016);
    expect(frame.graceRemaining).toBe(0);
    expect(frame.tier).toBe('calm');
  });

  it('reports Rush and Overdrive only when crossing upward into them', () => {
    const system = new FlowSystem();
    let frame = system.update({ ...createInitialState(), flow: 5.8 }, 0.016);
    expect(frame.enteredTier).toBeNull();
    frame = system.update({ ...frame.state, flow: 6.2 }, 0.016);
    expect(frame.enteredTier).toBe('rush');
    frame = system.update({ ...frame.state, flow: 7.1 }, 0.016);
    expect(frame.enteredTier).toBeNull();
    frame = system.update({ ...frame.state, flow: 9.1 }, 0.016);
    expect(frame.enteredTier).toBe('overdrive');
  });

  it('can report Rush again after Flow falls below the tier', () => {
    const system = new FlowSystem();
    let frame = system.update({ ...createInitialState(), flow: 6.4 }, 0.016);
    expect(frame.enteredTier).toBe('rush');
    frame = system.update({ ...frame.state, flow: 5.5 }, 0.016);
    expect(frame.enteredTier).toBeNull();
    frame = system.update({ ...frame.state, flow: 6.1 }, 0.016);
    expect(frame.enteredTier).toBe('rush');
  });
});
