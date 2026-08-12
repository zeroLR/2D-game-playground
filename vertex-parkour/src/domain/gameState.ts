export type Vec2 = { x: number; y: number };

export const PLAYER_FEET_OFFSET = 24;
export const GRAVITY = 1220;
export const AUTO_JUMP_VELOCITY = -540;
export const MAX_FALL_SPEED = 760;
export const MAX_AUTO_JUMP_RISE = (AUTO_JUMP_VELOCITY * AUTO_JUMP_VELOCITY) / (2 * GRAVITY);

export type GameState = {
  playerX: number;
  playerY: number;
  velocityY: number;
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
  velocityY: AUTO_JUMP_VELOCITY,
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
  const velocityY = Math.min(MAX_FALL_SPEED, state.velocityY + GRAVITY * deltaSeconds);
  const playerY = state.playerY + velocityY * deltaSeconds;
  const climbed = Math.max(0, state.playerY - playerY);

  return {
    ...state,
    elapsed,
    playerY,
    velocityY,
    speed: Math.abs(velocityY),
    score: state.score + climbed * Math.max(1, state.flow),
  };
}

export function applyLanding(state: GameState, platformY: number): GameState {
  if (state.gameOver) return state;
  return {
    ...state,
    playerY: platformY - PLAYER_FEET_OFFSET,
    velocityY: AUTO_JUMP_VELOCITY,
    flow: Math.min(12, state.flow + 0.25),
  };
}

export function applyDash(state: GameState, direction: -1 | 1): GameState {
  if (state.gameOver) return state;
  return {
    ...state,
    playerX: Math.max(52, Math.min(308, state.playerX + direction * 92)),
    velocityY: Math.min(state.velocityY, 40),
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
