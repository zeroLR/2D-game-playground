import { describe, expect, it } from 'vitest';
import { applyDash, applyDroneKill, createInitialState, tickState } from '../src/domain/gameState';
import { applySkill, } from '../src/domain/gameState';
import { availableSkills, createEmptySkillLevels } from '../src/domain/skills';
import { getFlowGraceSeconds, FLOW_GRACE_SECONDS, FLOW_UPGRADE_GRACE_BONUS } from '../src/systems/FlowSystem';

describe('run-local skills', () => {
  it('starts with an empty skill build', () => {
    const state = createInitialState();
    expect(state.skills).toEqual(createEmptySkillLevels());
  });

  it('caps repeated skill acquisition at tier 3', () => {
    let state = createInitialState();
    for (let i = 0; i < 5; i += 1) state = applySkill(state, 'phase-dash');
    expect(state.skills['phase-dash']).toBe(3);
    expect(availableSkills(state.skills)).not.toContain('phase-dash');
  });

  it('Phase Dash increases dash velocity', () => {
    const base = applyDash(createInitialState(), 1, 1);
    const skilled = applyDash(applySkill(createInitialState(), 'phase-dash'), 1, 1);
    expect(skilled.velocityX).toBeGreaterThan(base.velocityX);
  });

  it('Rebound increases the next automatic jump', () => {
    const landed = { ...applySkill(createInitialState(), 'rebound'), landingTime: 0.01, velocityY: 0 };
    const next = tickState(landed, 0.02);
    expect(next.velocityY).toBeLessThan(-540);
  });

  it('Kill Refund increases Flow from a drone kill', () => {
    const base = applyDroneKill(createInitialState());
    const skilled = applyDroneKill(applySkill(createInitialState(), 'kill-refund'));
    expect(skilled.flow).toBeGreaterThan(base.flow);
  });

  it('Continuity increases Flow grace', () => {
    const skilled = applySkill(createInitialState(), 'continuity');
    expect(getFlowGraceSeconds(skilled)).toBeCloseTo(FLOW_GRACE_SECONDS + FLOW_UPGRADE_GRACE_BONUS);
  });
});
