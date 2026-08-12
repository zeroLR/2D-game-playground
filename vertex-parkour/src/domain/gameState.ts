export type Vec2 = { x: number; y: number };

export const PLAYER_FEET_OFFSET = 24;
export const AUTO_JUMP_VELOCITY = -540;
export const RISE_GRAVITY = 1080;
export const FALL_GRAVITY = 1500;
export const APEX_GRAVITY = 620;
export const APEX_SPEED = 75;
export const MAX_FALL_SPEED = 820;
export const MIN_DASH_SPEED = 380;
export const MAX_DASH_SPEED = 760;
export const DASH_SPEED = MAX_DASH_SPEED;
export const DASH_DURATION = 0.13;
export const DASH_DRAG = 10;
export const MIN_DASH_STRENGTH = 0.35;
export const LANDING_DELAY = 0.06;
export const MAX_AUTO_JUMP_RISE = (AUTO_JUMP_VELOCITY * AUTO_JUMP_VELOCITY) / (2 * RISE_GRAVITY);

export type GameState = {
  playerX: number;
  playerY: number;
  velocityX: number;
  velocityY: number;
  dashTime: number;
  landingTime: number;
  score: number;
  flow: number;
  hp: number;
  elapsed: number;
  speed: number;
  gameOver: boolean;
};

export const createInitialState = (): GameState => ({
  playerX: 180,
  playerY: 578,
  velocityX: 0,
  velocityY: AUTO_JUMP_VELOCITY,
  dashTime: 0,
  landingTime: 0,
  score: 0,
  flow: 1,
  hp: 3,
  elapsed: 0,
  speed: 0,
  gameOver: false,
});

export function tickState(state: GameState, deltaSeconds: number): GameState {
  if (state.gameOver) return state;

  const elapsed = state.elapsed + deltaSeconds;
  const landingTime = Math.max(0, state.landingTime - deltaSeconds);
  let velocityY = state.velocityY;
  let playerY = state.playerY;

  if (state.landingTime > 0) {
    if (landingTime <= 0) velocityY = AUTO_JUMP_VELOCITY;
    else velocityY = 0;
  } else {
    const gravity = Math.abs(velocityY) <= APEX_SPEED
      ? APEX_GRAVITY
      : velocityY < 0
        ? RISE_GRAVITY
        : FALL_GRAVITY;
    velocityY = Math.min(MAX_FALL_SPEED, velocityY + gravity * deltaSeconds);
    playerY += velocityY * deltaSeconds;
  }

  const dashTime = Math.max(0, state.dashTime - deltaSeconds);
  const velocityX = dashTime > 0
    ? state.velocityX
    : state.velocityX * Math.max(0, 1 - DASH_DRAG * deltaSeconds);
  const playerX = Math.max(52, Math.min(308, state.playerX + velocityX * deltaSeconds));
  const climbed = Math.max(0, state.playerY - playerY);

  return {
    ...state,
    elapsed,
    playerX,
    playerY,
    velocityX,
    velocityY,
    dashTime,
    landingTime,
    speed: Math.hypot(velocityX, velocityY),
    score: state.score + climbed * Math.max(1, state.flow),
  };
}

export function applyLanding(state: GameState, platformY: number): GameState {
  if (state.gameOver) return state;
  return {
    ...state,
    playerY: platformY - PLAYER_FEET_OFFSET,
    velocityY: 0,
    landingTime: LANDING_DELAY,
    flow: Math.min(12, state.flow + 0.25),
  };
}

export function applyDash(state: GameState, direction: -1 | 1, strength = 1): GameState {
  if (state.gameOver) return state;
  const clampedStrength = Math.max(MIN_DASH_STRENGTH, Math.min(1, strength));
  const dashSpeed = MIN_DASH_SPEED + (MAX_DASH_SPEED - MIN_DASH_SPEED) * clampedStrength;
  return {
    ...state,
    velocityX: direction * dashSpeed,
    dashTime: DASH_DURATION,
    velocityY: Math.min(state.velocityY, 25),
    flow: Math.min(12, state.flow + 0.6),
  };
}

export function applyHit(state: GameState): GameState {
  const hp = state.hp - 1;
  return {
    ...state,
    hp,
    flow: 1,
    gameOver: hp <= 0,
  };
}
