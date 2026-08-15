import { describe, expect, it } from 'vitest';
import { DEFAULT_DEV_TUNING, clampDevTuning } from '../src/dev/DevTuning';
import { applyDash, createInitialState, tickState } from '../src/domain/gameState';

describe('Dev tuning', () => {
  it('keeps production/default physics unchanged at 1x', () => {
    expect(createInitialState().velocityY).toBe(createInitialState(DEFAULT_DEV_TUNING).velocityY);
  });

  it('scales jump launch power independently', () => {
    const normal = createInitialState();
    const boosted = createInitialState({ ...DEFAULT_DEV_TUNING, jumpPower: 1.5 });
    expect(boosted.velocityY).toBeCloseTo(normal.velocityY * 1.5);
  });

  it('scales dash power independently', () => {
    const state = createInitialState();
    const normal = applyDash(state, 1, 1);
    const boosted = applyDash(state, 1, 1, { ...DEFAULT_DEV_TUNING, dashPower: 1.8 });
    expect(boosted.velocityX).toBeCloseTo(normal.velocityX * 1.8);
  });

  it('changes vertical arc tempo without changing real elapsed time', () => {
    const state = createInitialState();
    const normal = tickState(state, 0.02);
    const fast = tickState(state, 0.02, { ...DEFAULT_DEV_TUNING, jumpSpeed: 2 });
    expect(fast.elapsed).toBeCloseTo(normal.elapsed);
    expect(Math.abs(fast.playerY - state.playerY)).toBeGreaterThan(Math.abs(normal.playerY - state.playerY));
  });

  it('clamps unsafe panel values', () => {
    expect(clampDevTuning({ invincible: true, jumpPower: 9, dashPower: 0.1, jumpSpeed: 8 })).toEqual({
      invincible: true,
      jumpPower: 3,
      dashPower: 0.5,
      jumpSpeed: 2.5,
    });
  });
});
