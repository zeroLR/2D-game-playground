import { Cell, Player, Pos, isWin } from './game';
import { applyManaReward, manaReward } from './patterns';

export type ActionKind = 'place' | 'skill';

export type CombatState = {
  board: Cell[][];
  mana: number;
  activePlayer: Player;
};

export type PlaceAction = {
  kind: 'place';
  at: Pos;
};

export type SkillAction = {
  kind: 'skill';
  skillId: string;
  source?: Pos;
  target: Pos;
};

export type TurnAction = PlaceAction | SkillAction;

export type ActionResult = {
  ok: boolean;
  state: CombatState;
  consumedTurn: boolean;
  won: boolean;
  manaGained: number;
  error?: 'occupied' | 'invalid-skill' | 'insufficient-mana' | 'invalid-target';
};

export function executePlace(state: CombatState, action: PlaceAction): ActionResult {
  const { row, col } = action.at;
  if (state.board[row]?.[col] !== 0) {
    return { ok: false, state, consumedTurn: false, won: false, manaGained: 0, error: 'occupied' };
  }

  const board = state.board.map((line) => [...line]);
  board[row][col] = state.activePlayer;
  const won = isWin(board, action.at, state.activePlayer);
  const reward = won ? 0 : manaReward(board, action.at, state.activePlayer);

  return {
    ok: true,
    state: { ...state, board, mana: applyManaReward(state.mana, reward) },
    consumedTurn: true,
    won,
    manaGained: reward,
  };
}
