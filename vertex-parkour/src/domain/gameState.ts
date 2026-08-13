export type Vec2 = { x: number; y: number };

export const PLAYER_FEET_OFFSET = 24;
export const AUTO_JUMP_VELOCITY = -540;
export const RISE_GRAVITY = 1080;
export const FALL_GRAVITY = 1500;
export const APEX_GRAVITY = 620;
export const APEX_SPEED = 75;
export const MAX_FALL_SPEED = 820;
export const MIN_DASH_SPEED = 520;
export const MAX_DASH_SPEED = 760;
export const DASH_SPEED = MAX_DASH_SPEED;
export const DASH_DURATION = 0.13;
export const DASH_DRAG = 10;
export const MIN_DASH_STRENGTH = 0.35;
export const AIR_NUDGE_SPEED = 285;
export const AIR_NUDGE_DURATION = 0.085;
export const LANDING_DELAY = 0.06;
export const WALL_SLIDE_SPEED = 105;
export const WALL_JUMP_VELOCITY_X = 390;
export const WALL_JUMP_VELOCITY_Y = -455;
export const WALL_JUMP_LOCK = 0.11;
export const DRONE_BOUNCE_VELOCITY = -360;
export const CRYSTAL_LIFT_VELOCITY = -250;
export const MAX_AUTO_JUMP_RISE = (AUTO_JUMP_VELOCITY * AUTO_JUMP_VELOCITY) / (2 * RISE_GRAVITY);

export type GameState = {
  playerX: number; playerY: number; velocityX: number; velocityY: number;
  dashTime: number; dashReady: boolean; landingTime: number;
  wallSide: -1 | 0 | 1; wallJumpLock: number;
  score: number; flow: number; hp: number; elapsed: number; speed: number; gameOver: boolean;
};

export const createInitialState = (): GameState => ({
  playerX: 180, playerY: 578, velocityX: 0, velocityY: AUTO_JUMP_VELOCITY,
  dashTime: 0, dashReady: true, landingTime: 0, wallSide: 0, wallJumpLock: 0,
  score: 0, flow: 1, hp: 3, elapsed: 0, speed: 0, gameOver: false,
});

export function tickState(state: GameState, deltaSeconds: number): GameState {
  if (state.gameOver) return state;
  const elapsed = state.elapsed + deltaSeconds;
  const landingTime = Math.max(0, state.landingTime - deltaSeconds);
  const wallJumpLock = Math.max(0, state.wallJumpLock - deltaSeconds);
  let velocityY = state.velocityY; let playerY = state.playerY;
  if (state.landingTime > 0) { if (landingTime <= 0) velocityY = AUTO_JUMP_VELOCITY; else velocityY = 0; }
  else { const gravity = Math.abs(velocityY) <= APEX_SPEED ? APEX_GRAVITY : velocityY < 0 ? RISE_GRAVITY : FALL_GRAVITY; velocityY = Math.min(MAX_FALL_SPEED, velocityY + gravity * deltaSeconds); if (state.wallSide !== 0 && velocityY > WALL_SLIDE_SPEED) velocityY = WALL_SLIDE_SPEED; playerY += velocityY * deltaSeconds; }
  const dashTime = Math.max(0, state.dashTime - deltaSeconds);
  const velocityX = dashTime > 0 || wallJumpLock > 0 ? state.velocityX : state.velocityX * Math.max(0, 1 - DASH_DRAG * deltaSeconds);
  const playerX = Math.max(52, Math.min(308, state.playerX + velocityX * deltaSeconds));
  const climbed = Math.max(0, state.playerY - playerY);
  return { ...state, elapsed, playerX, playerY, velocityX, velocityY, dashTime, landingTime, wallJumpLock, speed: Math.hypot(velocityX, velocityY), score: state.score + climbed * Math.max(1, state.flow) };
}

export function applyLanding(state: GameState, platformY: number): GameState { if (state.gameOver) return state; return { ...state, playerY: platformY - PLAYER_FEET_OFFSET, velocityY: 0, landingTime: LANDING_DELAY, dashReady: true, wallSide: 0, flow: Math.min(12, state.flow + 0.25) }; }
export function applyWallContact(state: GameState, side: -1 | 1, wallX: number): GameState { if (state.gameOver || state.wallJumpLock > 0) return state; return { ...state, playerX: wallX - side * 14, velocityX: 0, velocityY: Math.min(state.velocityY, WALL_SLIDE_SPEED), wallSide: side, dashReady: true }; }
export function clearWallContact(state: GameState): GameState { return state.wallSide === 0 ? state : { ...state, wallSide: 0 }; }
export function applyWallJump(state: GameState): GameState { if (state.gameOver || state.wallSide === 0) return state; const direction = (state.wallSide * -1) as -1 | 1; return { ...state, velocityX: direction * WALL_JUMP_VELOCITY_X, velocityY: WALL_JUMP_VELOCITY_Y, dashTime: 0, dashReady: true, wallSide: 0, wallJumpLock: WALL_JUMP_LOCK, flow: Math.min(12, state.flow + 0.45) }; }
export function applyAirNudge(state: GameState, direction: -1 | 1, strength = 1): GameState { if (state.gameOver) return state; const clamped = Math.max(0.45, Math.min(1, strength)); return { ...state, velocityX: direction * AIR_NUDGE_SPEED * clamped, dashTime: AIR_NUDGE_DURATION }; }
export function applyDash(state: GameState, direction: -1 | 1, strength = 1): GameState { if (state.gameOver || !state.dashReady) return state; const clampedStrength = Math.max(MIN_DASH_STRENGTH, Math.min(1, strength)); const dashSpeed = MIN_DASH_SPEED + (MAX_DASH_SPEED - MIN_DASH_SPEED) * clampedStrength; return { ...state, velocityX: direction * dashSpeed, dashTime: DASH_DURATION, dashReady: false, wallSide: 0, velocityY: Math.min(state.velocityY, 25), flow: Math.min(12, state.flow + 0.6) }; }
export function applyCrystalPickup(state: GameState): GameState { if (state.gameOver) return state; return { ...state, dashReady: true, velocityY: Math.min(state.velocityY, CRYSTAL_LIFT_VELOCITY), score: state.score + 250, flow: Math.min(12, state.flow + 1.4) }; }
export function applyDroneKill(state: GameState): GameState { if (state.gameOver) return state; return { ...state, dashReady: true, velocityY: Math.min(state.velocityY, DRONE_BOUNCE_VELOCITY), score: state.score + 400, flow: Math.min(12, state.flow + 1.8) }; }
export function applyBreakableSmash(state: GameState): GameState { if (state.gameOver) return state; return { ...state, dashReady: true, score: state.score + 180, flow: Math.min(12, state.flow + 0.9) }; }
export function applyHit(state: GameState): GameState { const hp = state.hp - 1; return { ...state, hp, flow: 1, gameOver: hp <= 0 }; }
