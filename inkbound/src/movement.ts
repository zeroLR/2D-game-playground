export interface Rect { x: number; y: number; width: number; height: number }
export interface PlayerMotion { x: number; y: number; vx: number; vy: number; grounded: boolean; facing: -1 | 1; dashTime: number; dashCooldown: number }

export const PLAYER_HALF_WIDTH = 11;
export const PLAYER_HEIGHT = 42;
export const MOVE_SPEED = 150;
export const GRAVITY = 1050;
export const MAX_FALL_SPEED = 520;
export const CONTEXT_JUMP_VELOCITY = -355;
export const DASH_SPEED = 390;
export const DASH_DURATION = 0.18;
export const DASH_COOLDOWN = 0.45;

export function createPlayerMotion(x = 170, y = 420): PlayerMotion {
  return { x, y, vx: 0, vy: 0, grounded: false, facing: 1, dashTime: 0, dashCooldown: 0 };
}

export function stepPlayer(state: PlayerMotion, moveX: number, dashPressed: boolean, dt: number, platforms: Rect[]) {
  const wasDashReady = state.dashCooldown <= 0;
  state.dashCooldown = Math.max(0, state.dashCooldown - dt);
  if (dashPressed && wasDashReady && state.dashTime <= 0) {
    state.dashTime = DASH_DURATION;
    state.dashCooldown = DASH_COOLDOWN;
  }
  if (Math.abs(moveX) > 0.12) state.facing = moveX < 0 ? -1 : 1;

  if (state.dashTime > 0) {
    state.dashTime = Math.max(0, state.dashTime - dt);
    state.vx = state.facing * DASH_SPEED;
    state.vy = 0;
  } else {
    state.vx = moveX * MOVE_SPEED;
    state.vy = Math.min(MAX_FALL_SPEED, state.vy + GRAVITY * dt);
  }

  const oldX = state.x;
  const oldY = state.y;
  const nextX = state.x + state.vx * dt;
  const nextY = state.y + state.vy * dt;

  // Small ledges are crossed automatically while the player is grounded and pushing into them.
  if (state.grounded && Math.abs(moveX) > 0.45 && state.dashTime <= 0) {
    const dir = moveX < 0 ? -1 : 1;
    const footY = state.y;
    const front = state.x + dir * (PLAYER_HALF_WIDTH + 5);
    const ledge = platforms.find((p) => front >= p.x && front <= p.x + p.width && p.y < footY && footY - p.y <= 36);
    if (ledge) state.vy = CONTEXT_JUMP_VELOCITY;
  }

  state.x = nextX;
  state.y = nextY;
  state.grounded = false;

  // One-way top surfaces are enough for this prototype traversal slice.
  if (state.vy >= 0) {
    for (const p of platforms) {
      const withinX = state.x + PLAYER_HALF_WIDTH > p.x && state.x - PLAYER_HALF_WIDTH < p.x + p.width;
      const crossedTop = oldY <= p.y && state.y >= p.y;
      if (withinX && crossedTop) {
        state.y = p.y;
        state.vy = 0;
        state.grounded = true;
        break;
      }
    }
  }

  // Keep prototype traversal bounded while camera behavior is evaluated.
  state.x = Math.max(PLAYER_HALF_WIDTH, Math.min(1380 - PLAYER_HALF_WIDTH, state.x));
  if (state.y > 760) { state.x = oldX; state.y = oldY; state.vx = 0; state.vy = 0; }
}
