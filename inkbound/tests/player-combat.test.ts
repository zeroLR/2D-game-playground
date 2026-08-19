import { describe, expect, it } from 'vitest';
import { createPlayerCombatState, damagePlayer, PLAYER_INVULNERABILITY, resetPlayerCombat, stepPlayerCombat } from '../src/PlayerCombat';

describe('player combat state', () => {
  it('takes one damage then rejects hits during invulnerability', () => {
    const state = createPlayerCombatState();
    expect(damagePlayer(state)).toBe(true); expect(state.hp).toBe(4); expect(state.invulnerability).toBe(PLAYER_INVULNERABILITY);
    expect(damagePlayer(state)).toBe(false); expect(state.hp).toBe(4);
  });
  it('can take damage again after invulnerability expires', () => {
    const state = createPlayerCombatState(); damagePlayer(state); stepPlayerCombat(state, PLAYER_INVULNERABILITY);
    expect(damagePlayer(state)).toBe(true); expect(state.hp).toBe(3);
  });
  it('dies at zero hp and can reset', () => {
    const state = createPlayerCombatState();
    for (let i = 0; i < 5; i++) { state.invulnerability = 0; damagePlayer(state); }
    expect(state.dead).toBe(true); expect(state.hp).toBe(0); resetPlayerCombat(state); expect(state.dead).toBe(false); expect(state.hp).toBe(5);
  });
});
