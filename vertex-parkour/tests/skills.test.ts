import { describe, expect, it } from 'vitest';
import { applyAirNudge, applyDash, applyDroneKill, applyHit, applyLanding, applySkill, createInitialState, tickState } from '../src/domain/gameState';
import { availableSkills, createEmptySkillLevels, SKILL_POOL, skillsForArchetype } from '../src/domain/skills';
import { getFlowGraceSeconds, FLOW_GRACE_SECONDS, FLOW_UPGRADE_GRACE_BONUS } from '../src/systems/FlowSystem';

describe('run-local skills', () => {
  it('exposes twelve skills split evenly across four archetypes', () => {
    expect(SKILL_POOL).toHaveLength(12);
    expect(skillsForArchetype('dash')).toHaveLength(3);
    expect(skillsForArchetype('jump')).toHaveLength(3);
    expect(skillsForArchetype('kill')).toHaveLength(3);
    expect(skillsForArchetype('flow')).toHaveLength(3);
  });

  it('starts with an empty skill build', () => {
    const state = createInitialState();
    expect(state.skills).toEqual(createEmptySkillLevels());
    expect(Object.values(state.skills).every((level) => level === 0)).toBe(true);
  });

  it('respects per-skill tier caps', () => {
    let state = createInitialState();
    for (let i = 0; i < 5; i += 1) state = applySkill(state, 'phase-dash');
    expect(state.skills['phase-dash']).toBe(3);
    expect(availableSkills(state.skills)).not.toContain('phase-dash');
    state = applySkill(applySkill(state, 'flow-shield'), 'flow-shield');
    expect(state.skills['flow-shield']).toBe(1);
  });

  it('Phase Dash and Afterimage create distinct dash upgrades', () => {
    const base = applyDash(createInitialState(), 1, 1);
    const phase = applyDash(applySkill(createInitialState(), 'phase-dash'), 1, 1);
    const afterimage = applyDash(applySkill(createInitialState(), 'afterimage'), 1, 1);
    expect(phase.velocityX).toBeGreaterThan(base.velocityX);
    expect(afterimage.dashTime).toBeGreaterThan(base.dashTime);
  });

  it('Blink Reset rewards high-flow landings', () => {
    const base = applyLanding({ ...createInitialState(), flow: 6 }, 500);
    const skilled = applyLanding({ ...applySkill(createInitialState(), 'blink-reset'), flow: 6 }, 500);
    expect(skilled.flow).toBeGreaterThan(base.flow);
  });

  it('Rebound and Predator strengthen earned automatic jumps', () => {
    const rebound = tickState({ ...applySkill(createInitialState(), 'rebound'), landingTime: 0.01, velocityY: 0 }, 0.02);
    expect(rebound.velocityY).toBeLessThan(-540);
    let predator = applySkill(createInitialState(), 'predator');
    predator = applyDroneKill(predator);
    predator = tickState({ ...predator, landingTime: 0.01, velocityY: 0 }, 0.02);
    expect(predator.velocityY).toBeLessThan(-540);
  });

  it('Aerial Step strengthens air correction and Impact builds landing Flow', () => {
    expect(applyAirNudge(applySkill(createInitialState(), 'aerial-step'), 1).velocityX).toBeGreaterThan(applyAirNudge(createInitialState(), 1).velocityX);
    expect(applyLanding(applySkill(createInitialState(), 'impact'), 500).flow).toBeGreaterThan(applyLanding(createInitialState(), 500).flow);
  });

  it('Kill Refund and Execution reward kills through different conditions', () => {
    const base = applyDroneKill(createInitialState());
    expect(applyDroneKill(applySkill(createInitialState(), 'kill-refund')).flow).toBeGreaterThan(base.flow);
    const highFlow = { ...createInitialState(), flow: 6 };
    expect(applyDroneKill(applySkill(highFlow, 'execution')).flow).toBeGreaterThan(applyDroneKill(highFlow).flow);
  });

  it('Continuity increases Flow grace and Overdrive improves Rush+ control', () => {
    const continuity = applySkill(createInitialState(), 'continuity');
    expect(getFlowGraceSeconds(continuity)).toBeCloseTo(FLOW_GRACE_SECONDS + FLOW_UPGRADE_GRACE_BONUS);
    const highFlow = { ...createInitialState(), flow: 6 };
    expect(applyAirNudge(applySkill(highFlow, 'overdrive'), 1).velocityX).toBeGreaterThan(applyAirNudge(highFlow, 1).velocityX);
  });

  it('Flow Shield converts a Perfect Flow hit into Flow loss instead of HP loss', () => {
    const state = { ...applySkill(createInitialState(), 'flow-shield'), flow: 12 };
    const hit = applyHit(state);
    expect(hit.hp).toBe(state.hp);
    expect(hit.flow).toBeLessThan(12);
  });
});
