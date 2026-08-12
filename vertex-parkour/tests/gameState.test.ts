import { describe, expect, it } from 'vitest';
import { applyDash, applyHit, createInitialState, tickState } from '../src/domain/gameState';

describe('game state', () => {
  it('accelerates and scores over time', () => {
    const next = tickState(createInitialState(), 1);
    expect(next.elapsed).toBe(1);
    expect(next.speed).toBeGreaterThan(120);
    expect(next.score).toBeGreaterThan(0);
  });

  it('clamps dash inside portrait lanes', () => {
    let state = createInitialState();
    for (let i = 0; i < 10; i++) state = applyDash(state, -1);
    expect(state.playerX).toBe(52);
    for (let i = 0; i < 10; i++) state = applyDash(state, 1);
    expect(state.playerX).toBe(308);
  });

  it('ends the run after three hits', () => {
    let state = createInitialState();
    state = applyHit(state);
    state = applyHit(state);
    state = applyHit(state);
    expect(state.gameOver).toBe(true);
    expect(state.hp).toBe(0);
  });
});
