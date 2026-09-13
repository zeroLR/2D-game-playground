import { describe, expect, it } from 'vitest';
import { EncounterRuleSystem } from '../src/game/EncounterRuleSystem';
import type { TargetState } from '../src/game/TargetSystem';

function target(id: number, role: TargetState['role'] = 'standard'): TargetState {
  return {
    id,
    kind: 'crystal',
    role,
    position: { x: 100, y: 120 },
    radius: 16,
    hp: 1,
    maxHp: 1,
  };
}

describe('EncounterRuleSystem', () => {
  it('turns an authored drift field into a signed orbit step', () => {
    const clockwise = new EncounterRuleSystem({
      modifiers: [{ kind: 'drift-field', direction: 'clockwise', turnsPerSecond: 0.02 }],
    });
    const counter = new EncounterRuleSystem({
      modifiers: [{ kind: 'drift-field', direction: 'counterclockwise', turnsPerSecond: 0.02 }],
    });

    expect(clockwise.driftOrbitFactor(0.5)).toBeCloseTo(Math.PI * 0.02);
    expect(counter.driftOrbitFactor(0.5)).toBeCloseTo(-Math.PI * 0.02);
    expect(clockwise.snapshot).toMatchObject({
      modifierKinds: ['drift-field'],
      driftDirection: 'clockwise',
      driftTurnsPerSecond: 0.02,
    });
  });

  it('makes a rune-ward elite reject direct ball damage but accept Rune-authored impacts', () => {
    const system = new EncounterRuleSystem({ elite: { title: 'FRACTURE WARDEN', trait: 'rune-ward' } });
    const elite = target(7, 'elite');
    system.bindEliteTarget(elite);

    expect(system.allowsDamage(elite, 'ball')).toBe(false);
    expect(system.allowsDamage(elite, 'split')).toBe(true);
    expect(system.allowsDamage(elite, 'chain')).toBe(true);
    expect(system.allowsDamage(elite, 'singularity')).toBe(true);
    expect(system.movementLockedTargetIds().has(7)).toBe(true);
  });

  it('does not apply elite restrictions to normal targets', () => {
    const system = new EncounterRuleSystem({ elite: { title: 'FRACTURE WARDEN', trait: 'rune-ward' } });
    system.bindEliteTarget(target(7, 'elite'));

    expect(system.allowsDamage(target(4), 'ball')).toBe(true);
    expect(system.movementLockedTargetIds().has(4)).toBe(false);
  });

  it('rejects unreadably fast drift authoring', () => {
    expect(() => new EncounterRuleSystem({
      modifiers: [{ kind: 'drift-field', direction: 'clockwise', turnsPerSecond: 0.2 }],
    })).toThrow(/must not exceed/);
  });
});
