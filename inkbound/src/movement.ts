export interface Rect { x: number; y: number; width: number; height: number }
export interface PlayerMotion { x: number; y: number; vx: number; vy: number; grounded: boolean; facing: -1 | 1; dashTime: number; dashCooldown: number; contextJumpTime: number; contextJumpDir: -1 | 0 | 1 }

export const PLAYER_HALF_WIDTH = 11;
export const PLAYER_HEIGHT = 42;
export const MOVE_SPEED = 150;
export const GRAVITY = 1050;
export const MAX_FALL_SPEED = 520;
export const CONTEXT_JUMP_VELOCITY = -355;
export const CONTEXT_JUMP_SPEED = 190;
export const CONTEXT_JUMP_DURATION = 0.22;
export const CONTEXT_STEP_HEIGHT = 52;
export const CONTEXT_PROBE_DISTANCE = 48;
export const MOVEMENT_INTENT_THRESHOLD = 0.06;
export const DASH_SPEED = 390;
export const DASH_DURATION = 0.18;
export const DASH_COOLDOWN = 0.45;

export function createPlayerMotion(x = 170, y = 420): PlayerMotion {
  return { x, y, vx: 0, vy: 0, grounded: false, facing: 1, dashTime: 0, dashCooldown: 0, contextJumpTime: 0, contextJumpDir: 0 };
}

function findRaisedLedge(state: PlayerMotion, dir: -1 | 1, platforms: Rect[]) {
  const footY = state.y;
  const probeStart = state.x + dir * PLAYER_HALF_WIDTH;
  const probeEnd = probeStart + dir * CONTEXT_PROBE_DISTANCE;
  return platforms.find((p) => {
    const crossesEdge = dir > 0 ? probeStart <= p.x && probeEnd >= p.x : probeStart >= p.x + p.width && probeEnd <= p.x + p.width;
    const rise = footY - p.y;
    return crossesEdge && rise > 0 && rise <= CONTEXT_STEP_HEIGHT;
  });
}

export function stepPlayer(state: PlayerMotion, moveX: number, dashPressed: boolean, dt: number, platforms: Rect[]) {
  const hasMoveIntent = Math.abs(moveX) >= MOVEMENT_INTENT_THRESHOLD;
  const wasDashReady = state.dashCooldown <= 0;
  state.dashCooldown = Math.max(0, state.dashCooldown - dt);
  if (dashPressed && wasDashReady && state.dashTime <= 0) { state.dashTime = DASH_DURATION; state.dashCooldown = DASH_COOLDOWN; state.contextJumpTime = 0; }
  if (hasMoveIntent) state.facing = moveX < 0 ? -1 : 1;

  const dir: -1 | 1 = hasMoveIntent ? (moveX < 0 ? -1 : 1) : state.facing;
  // Context traversal follows actual analog intent, not a half-stick threshold. The previous
  // 0.35 gate meant a careful/slow walk could leave ground before the raised-ledge assist fired.
  const ledge = state.grounded && hasMoveIntent ? findRaisedLedge(state, dir, platforms) : undefined;
  if (ledge && state.dashTime <= 0) {
    state.vy = CONTEXT_JUMP_VELOCITY; state.grounded = false;
    state.contextJumpTime = CONTEXT_JUMP_DURATION; state.contextJumpDir = dir;
  } else if (ledge && state.dashTime > 0) {
    state.y = ledge.y; state.vy = 0; state.grounded = true;
  }

  if (state.dashTime > 0) {
    state.dashTime = Math.max(0, state.dashTime - dt); state.vx = state.facing * DASH_SPEED;
    if (!ledge) state.vy = 0;
  } else {
    state.contextJumpTime = Math.max(0, state.contextJumpTime - dt);
    state.vx = state.contextJumpTime > 0 ? state.contextJumpDir * Math.max(CONTEXT_JUMP_SPEED, Math.abs(moveX * MOVE_SPEED)) : moveX * MOVE_SPEED;
    if (!ledge) state.vy = Math.min(MAX_FALL_SPEED, state.vy + GRAVITY * dt);
  }

  const oldX = state.x; const oldY = state.y;
  state.x += state.vx * dt; state.y += state.vy * dt;
  state.grounded = Boolean(ledge && state.dashTime > 0);

  if (state.vy >= 0) {
    for (const p of platforms) {
      const withinX = state.x + PLAYER_HALF_WIDTH > p.x && state.x - PLAYER_HALF_WIDTH < p.x + p.width;
      const crossedTop = oldY <= p.y && state.y >= p.y;
      if (withinX && crossedTop) { state.y = p.y; state.vy = 0; state.grounded = true; state.contextJumpTime = 0; state.contextJumpDir = 0; break; }
    }
  }

  state.x = Math.max(PLAYER_HALF_WIDTH, Math.min(1380 - PLAYER_HALF_WIDTH, state.x));
  if (state.y > 760) { state.x = oldX; state.y = oldY; state.vx = 0; state.vy = 0; }
}
