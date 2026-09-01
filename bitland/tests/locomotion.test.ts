import { describe, expect, it } from 'vitest';
import { createLocomotionState, stepLocomotion } from '../src/simulation/player/locomotion';

const step = (state: ReturnType<typeof createLocomotionState>, moveX: number, jumpPressed = false, dt = 1 / 60) => {
  stepLocomotion(state, { moveX, jumpPressed, guardHeld: false }, dt, 364, 18, 1902);
};

describe('locomotion', () => {
  it('accelerates toward run speed instead of snapping', () => {
    const state = createLocomotionState(180, 364);
    step(state, 1);
    expect(state.vx).toBeGreaterThan(0);
    expect(state.vx).toBeLessThan(220);
  });

  it('consumes buffered jump on landing', () => {
    const state = createLocomotionState(180, 350);
    state.grounded = false;
    state.vy = 250;
    step(state, 0, true, 0.05);
    step(state, 0, false, 0.05);
    expect(state.vy).toBeLessThan(0);
    expect(state.grounded).toBe(false);
  });

  it('keeps limited horizontal control in the air', () => {
    const state = createLocomotionState(180, 330);
    state.grounded = false;
    step(state, 1);
    expect(state.vx).toBeGreaterThan(0);
    expect(state.vx).toBeLessThan(40);
  });
});
