import { describe, expect, it } from 'vitest';
import {
  AUTO_JUMP_VELOCITY,
  DASH_SPEED,
  LANDING_DELAY,
  MAX_AUTO_JUMP_RISE,
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

  it('keeps the auto-jump rise above the largest generated platform gap', () => {
    expect(MAX_AUTO_JUMP_RISE).toBeGreaterThan(104);
  });

  it('compresses briefly before auto-jumping after landing', () => {
    let state = applyLanding({ ...createInitialState(), playerY: 500, velocityY: 300 }, 540);
    expect(state.playerY).toBe(540 - PLAYER_FEET_OFFSET);
    expect(state.velocityY).toBe(0);
    expect(state.landingTime).toBe(LANDING_DELAY);
    state = tickState(state, LANDING_DELAY + 0.001);
    expect(state.velocityY).toBe(AUTO_JUMP_VELOCITY);
  });

  it('uses horizontal velocity for dash instead of teleporting', () => {
    const initial = { ...createInitialState(), velocityY: 300 };
    const dashed = applyDash(initial, 1);
    expect(dashed.playerX).toBe(initial.playerX);
    expect(dashed.velocityX).toBe(DASH_SPEED);
    expect(dashed.velocityY).toBeLessThanOrEqual(25);
    const moved = tickState(dashed, 0.05);
    expect(moved.playerX).toBeGreaterThan(initial.playerX);
    expect(moved.playerX).toBeLessThanOrEqual(308);
  });

  it('clamps horizontal movement inside the portrait playfield', () => {
    let state = { ...createInitialState(), playerX: 307, velocityX: DASH_SPEED, dashTime: 1 };
    state = tickState(state, 0.1);
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
