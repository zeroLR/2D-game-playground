import { describe, expect, it } from 'vitest';
import {
  AUTO_JUMP_VELOCITY,
  PLAYER_FEET_OFFSET,
  applyDash,
  applyHit,
  applyLanding,
  createInitialState,
  tickState,
} from '../src/domain/gameState';

describe('game state', () => {
  it('integrates vertical velocity with gravity', () => {
    const initial = createInitialState();
    const next = tickState(initial, 0.1);
    expect(next.elapsed).toBeCloseTo(0.1);
    expect(next.velocityY).toBeGreaterThan(initial.velocityY);
    expect(next.playerY).toBeLessThan(initial.playerY);
    expect(next.score).toBeGreaterThan(0);
  });

  it('auto-jumps immediately after landing on a platform', () => {
    const landed = applyLanding({ ...createInitialState(), playerY: 500, velocityY: 300 }, 540);
    expect(landed.playerY).toBe(540 - PLAYER_FEET_OFFSET);
    expect(landed.velocityY).toBe(AUTO_JUMP_VELOCITY);
  });

  it('clamps dash inside the portrait playfield and softens downward momentum', () => {
    let state = { ...createInitialState(), velocityY: 300 };
    state = applyDash(state, 1);
    expect(state.velocityY).toBeLessThanOrEqual(40);
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
