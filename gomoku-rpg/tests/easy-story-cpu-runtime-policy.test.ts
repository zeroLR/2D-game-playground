import { describe, expect, it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { cpuActionCandidates } from '../src/runtime/cpu-runtime';

describe('Easy Story CPU runtime policy', () => {
  it('keeps placement candidates but removes RPG skill candidates when skills are disabled', () => {
    const state = createCombatState(createBoard());
    state.mana[2] = 10;
    state.board[7][7] = 2;
    state.board[7][8] = 1;

    const full = cpuActionCandidates(state, 'vanguard', true);
    const teaching = cpuActionCandidates(state, 'vanguard', false);

    expect(full.some(action => action.kind === 'skill')).toBe(true);
    expect(teaching.length).toBeGreaterThan(0);
    expect(teaching.every(action => action.kind === 'place')).toBe(true);
  });

  it('preserves full CPU behavior by default for Free Battle compatibility', () => {
    const state = createCombatState(createBoard());
    state.mana[2] = 10;
    state.board[7][7] = 2;
    state.board[7][8] = 1;

    expect(cpuActionCandidates(state, 'vanguard').some(action => action.kind === 'skill')).toBe(true);
  });
});
