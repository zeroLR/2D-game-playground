export type Vec2 = { x: number; y: number };

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
  playerY: 540,
  velocityY: 0,
  score: 0,
  flow: 1,
  hp: 3,
  elapsed: 0,
  speed: 120,
  gameOver: false,
});

export function tickState(state: GameState, deltaSeconds: number): GameState {
  if (state.gameOver) return state;

  const elapsed = state.elapsed + deltaSeconds;
  const speed = Math.min(250, 120 + elapsed * 4.2);
  return {
    ...state,
    elapsed,
    speed,
    score: state.score + speed * deltaSeconds * Math.max(1, state.flow),
  };
}

export function applyDash(state: GameState, direction: -1 | 1): GameState {
  if (state.gameOver) return state;
  return {
    ...state,
    playerX: Math.max(52, Math.min(308, state.playerX + direction * 92)),
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
