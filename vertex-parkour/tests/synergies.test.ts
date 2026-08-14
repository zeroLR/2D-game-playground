import { describe, expect, it } from 'vitest';
import { applyDash, applyDroneKill, applyLanding, applySkill, createInitialState, MOMENTUM_LOOP_FLOW_BONUS, tickState } from '../src/domain/gameState';
import { getActiveSynergies } from '../src/domain/synergies';

describe('build synergies', () => {
  it('activates Momentum Loop from Dash + Flow', () => {
    let state = applySkill(createInitialState(), 'phase-dash');
    state = applySkill(state, 'continuity');
    expect(getActiveSynergies(state.skills)).toContain('momentum-loop');
  });

  it('Momentum Loop adds Flow to a successful Dash action', () => {
    const base = applyDash(createInitialState(), 1, 1);
    let state = applySkill(createInitialState(), 'phase-dash');
    state = applySkill(state, 'continuity');
    const synergized = applyDash(state, 1, 1);
    expect(synergized.flow - base.flow).toBeCloseTo(MOMENTUM_LOOP_FLOW_BONUS);
  });

  it('activates Predator Rhythm from Kill + Jump', () => {
    let state = applySkill(createInitialState(), 'kill-refund');
    state = applySkill(state, 'rebound');
    expect(getActiveSynergies(state.skills)).toContain('predator-rhythm');
  });

  it('Predator Rhythm empowers only the next landing jump after a drone kill', () => {
    let state = applySkill(createInitialState(), 'kill-refund');
    state = applySkill(state, 'rebound');
    state = applyDroneKill(state);
    expect(state.predatorRhythmReady).toBe(true);
    state = applyLanding(state, 500);
    state = tickState(state, 0.07);
    expect(state.velocityY).toBeLessThan(-540 * 1.08);
    expect(state.predatorRhythmReady).toBe(false);
  });

  it('does not activate a synergy from only one side of the pair', () => {
    const state = applySkill(createInitialState(), 'phase-dash');
    expect(getActiveSynergies(state.skills)).toEqual([]);
  });
});
