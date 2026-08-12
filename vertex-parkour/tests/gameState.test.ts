import { describe, expect, it } from 'vitest';
import {
  AUTO_JUMP_VELOCITY,
  CRYSTAL_LIFT_VELOCITY,
  DASH_SPEED,
  DRONE_BOUNCE_VELOCITY,
  LANDING_DELAY,
  MAX_AUTO_JUMP_RISE,
  MAX_DASH_SPEED,
  MIN_DASH_SPEED,
  PLAYER_FEET_OFFSET,
  applyCrystalPickup,
  applyDash,
  applyDroneKill,
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

  it('compresses briefly before auto-jumping and restores dash on landing', () => {
    let state = applyDash(createInitialState(), 1);
    expect(state.dashReady).toBe(false);
    state = applyLanding({ ...state, playerY: 500, velocityY: 300 }, 540);
    expect(state.playerY).toBe(540 - PLAYER_FEET_OFFSET);
    expect(state.velocityY).toBe(0);
    expect(state.landingTime).toBe(LANDING_DELAY);
    expect(state.dashReady).toBe(true);
    state = tickState(state, LANDING_DELAY + 0.001);
    expect(state.velocityY).toBe(AUTO_JUMP_VELOCITY);
  });

  it('consumes one dash until a traversal resource resets it', () => {
    const initial = createInitialState();
    const firstDash = applyDash(initial, 1);
    expect(firstDash.dashReady).toBe(false);
    const ignoredSecondDash = applyDash(firstDash, -1);
    expect(ignoredSecondDash.velocityX).toBe(firstDash.velocityX);

    const crystalReset = applyCrystalPickup(firstDash);
    expect(crystalReset.dashReady).toBe(true);
    expect(crystalReset.velocityY).toBeLessThanOrEqual(CRYSTAL_LIFT_VELOCITY);

    const droneReset = applyDroneKill(firstDash);
    expect(droneReset.dashReady).toBe(true);
    expect(droneReset.velocityY).toBeLessThanOrEqual(DRONE_BOUNCE_VELOCITY);
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

  it('scales dash velocity with swipe strength while clamping the range', () => {
    const initial = createInitialState();
    const shortDash = applyDash(initial, 1, 0.35);
    const mediumDash = applyDash(initial, 1, 0.65);
    const fullDash = applyDash(initial, 1, 1);
    const overDash = applyDash(initial, 1, 2);
    expect(shortDash.velocityX).toBeGreaterThan(MIN_DASH_SPEED);
    expect(shortDash.velocityX).toBeLessThan(mediumDash.velocityX);
    expect(mediumDash.velocityX).toBeLessThan(fullDash.velocityX);
    expect(fullDash.velocityX).toBe(MAX_DASH_SPEED);
    expect(overDash.velocityX).toBe(MAX_DASH_SPEED);
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
