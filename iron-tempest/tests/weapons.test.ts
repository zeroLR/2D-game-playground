import { describe, expect, it } from 'vitest';
import { WEAPONS, cooldownFor, createWeaponState } from '../src/combat/weapons';

describe('weapon architecture', () => {
  it('gives the three primaries distinct firing profiles', () => {
    const state = createWeaponState();
    expect(WEAPONS.vulcan.fire({...state,id:'vulcan'})).toHaveLength(1);
    expect(WEAPONS.spread.fire({...state,id:'spread'})).toHaveLength(3);
    expect(WEAPONS.lance.fire({...state,id:'lance'})[0].pierce).toBeGreaterThan(0);
  });

  it('applies modifiers through weapon state', () => {
    const state = {...createWeaponState('vulcan'), twin:1, rapid:1, heavy:1, piercing:1};
    const shots = WEAPONS.vulcan.fire(state);
    expect(shots).toHaveLength(2);
    expect(shots[0].damage).toBe(2);
    expect(shots[0].pierce).toBe(1);
    expect(cooldownFor(state)).toBeLessThan(WEAPONS.vulcan.cooldown);
  });
});
