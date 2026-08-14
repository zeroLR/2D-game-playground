import { describe, expect, it } from 'vitest';
import { createInitialState } from '../src/domain/gameState';
import {
  FLOW_DECAY_PER_SECOND,
  FLOW_GRACE_SECONDS,
  FlowSystem,
  getFlowIntensity,
  getFlowTier,
} from '../src/systems/FlowSystem';

describe('FlowSystem', () => {
  it('maps Flow into readable tiers', () => {
    expect(getFlowTier(1)).toBe('calm');
    expect(getFlowTier(3)).toBe('engaged');
    expect(getFlowTier(6)).toBe('rush');
    expect(getFlowTier(9)).toBe('overdrive');
  });

  it('normalizes visual intensity across the Flow range', () => {
    expect(getFlowIntensity(1)).toBe(0);
    expect(getFlowIntensity(12)).toBe(1);
    expect(getFlowIntensity(20)).toBe(1);
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
});
