export type LocomotionState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  grounded: boolean;
  coyoteRemaining: number;
  jumpBufferRemaining: number;
  facing: -1 | 1;
};

export type LocomotionInput = {
  moveX: number;
  jumpPressed: boolean;
  guardHeld: boolean;
};

export type LocomotionConfig = {
  runSpeed: number;
  groundAcceleration: number;
  groundDeceleration: number;
  airAcceleration: number;
  gravity: number;
  jumpVelocity: number;
  coyoteTime: number;
  jumpBufferTime: number;
};

export const DEFAULT_LOCOMOTION: LocomotionConfig = {
  runSpeed: 220,
  groundAcceleration: 1700,
  groundDeceleration: 2100,
  airAcceleration: 850,
  gravity: 980,
  jumpVelocity: 360,
  coyoteTime: 0.09,
  jumpBufferTime: 0.11,
};

const approach = (value: number, target: number, amount: number): number => {
  if (value < target) return Math.min(value + amount, target);
  if (value > target) return Math.max(value - amount, target);
  return value;
};

export function createLocomotionState(x: number, y: number): LocomotionState {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    grounded: true,
    coyoteRemaining: DEFAULT_LOCOMOTION.coyoteTime,
    jumpBufferRemaining: 0,
    facing: 1,
  };
}

export function stepLocomotion(
  state: LocomotionState,
  input: LocomotionInput,
  dt: number,
  groundY: number,
  minX: number,
  maxX: number,
  config: LocomotionConfig = DEFAULT_LOCOMOTION,
): void {
  if (state.grounded) state.coyoteRemaining = config.coyoteTime;

  // Elevated platform support is resolved by the world collision layer after this step.
  // Releasing grounded here means walking beyond a platform edge naturally transitions to a fall,
  // while the refreshed coyote timer keeps jumps forgiving at that boundary.
  if (state.grounded && state.y < groundY - 0.5) state.grounded = false;

  const moveX = Math.max(-1, Math.min(1, input.moveX));
  if (Math.abs(moveX) > 0.05) state.facing = moveX < 0 ? -1 : 1;

  if (input.jumpPressed) state.jumpBufferRemaining = config.jumpBufferTime;
  else state.jumpBufferRemaining = Math.max(0, state.jumpBufferRemaining - dt);

  if (!state.grounded) state.coyoteRemaining = Math.max(0, state.coyoteRemaining - dt);

  const speedMultiplier = input.guardHeld ? 0.42 : 1;
  const targetVx = moveX * config.runSpeed * speedMultiplier;
  const acceleration = state.grounded
    ? (Math.abs(moveX) > 0.05 ? config.groundAcceleration : config.groundDeceleration)
    : config.airAcceleration;
  state.vx = approach(state.vx, targetVx, acceleration * dt);

  if (state.jumpBufferRemaining > 0 && state.coyoteRemaining > 0) {
    state.vy = -config.jumpVelocity;
    state.grounded = false;
    state.coyoteRemaining = 0;
    state.jumpBufferRemaining = 0;
  }

  if (!state.grounded) state.vy += config.gravity * dt;

  state.x = Math.max(minX, Math.min(maxX, state.x + state.vx * dt));
  state.y += state.vy * dt;

  if (state.y >= groundY) {
    state.y = groundY;
    state.vy = 0;
    state.grounded = true;
  }
}
