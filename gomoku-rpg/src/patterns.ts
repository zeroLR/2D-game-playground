import { BOARD_SIZE, Cell, Player, Pos } from './game';

export const MANA_CAP = 5;

export type PatternReward = {
  direction: 'vertical' | 'horizontal' | 'diagonal-down' | 'diagonal-up';
  length: 3 | 4;
  mana: 1 | 2;
};

const directions = [
  { name: 'vertical', dr: 1, dc: 0 },
  { name: 'horizontal', dr: 0, dc: 1 },
  { name: 'diagonal-down', dr: 1, dc: 1 },
  { name: 'diagonal-up', dr: 1, dc: -1 },
] as const;

function count(board: Cell[][], p: Pos, player: Player, dr: number, dc: number) {
  let total = 0;
  for (
    let row = p.row + dr, col = p.col + dc;
    row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE && board[row][col] === player;
    row += dr, col += dc
  ) total++;
  return total;
}

/** Scores only qualifying lines that pass through the newly placed stone. */
export function patternRewards(board: Cell[][], p: Pos, player: Player): PatternReward[] {
  if (board[p.row]?.[p.col] !== player) return [];

  return directions.flatMap(({ name, dr, dc }) => {
    const length = 1 + count(board, p, player, dr, dc) + count(board, p, player, -dr, -dc);
    if (length === 3) return [{ direction: name, length: 3 as const, mana: 1 as const }];
    if (length === 4) return [{ direction: name, length: 4 as const, mana: 2 as const }];
    return [];
  });
}

export function manaReward(board: Cell[][], p: Pos, player: Player) {
  return patternRewards(board, p, player).reduce((sum, reward) => sum + reward.mana, 0);
}

export function applyManaReward(currentMana: number, reward: number) {
  return Math.min(MANA_CAP, currentMana + reward);
}
