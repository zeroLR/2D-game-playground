import { describe, expect, it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState, setMana } from '../src/combat';
import { cpuActionCandidates } from '../src/runtime/cpu-runtime';

function createSkillReadyState() {
  let state = createCombatState(createBoard());
  state = setMana(state, 2, 10);
  state.board[7][7] = 2;
  state.board[7][8] = 1;
  return state;
}

describe('Easy Story CPU runtime policy', () => {
  it('keeps placement candidates but removes RPG skill candidates when skills are disabled', () => {
    const state = createSkillReadyState();

    const full = cpuActionCandidates(state, 'vanguard', true);
    const teaching = cpuActionCandidates(state, 'vanguard', false);

    expect(full.some(action => action.kind === 'skill')).toBe(true);
    expect(teaching.length).toBeGreaterThan(0);
    expect(teaching.every(action => action.kind === 'place')).toBe(true);
  });

  it('preserves full CPU behavior by default for Free Battle compatibility', () => {
    const state = createSkillReadyState();

    expect(cpuActionCandidates(state, 'vanguard').some(action => action.kind === 'skill')).toBe(true);
  });
});
