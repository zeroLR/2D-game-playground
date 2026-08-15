import { describe, expect, it } from 'vitest';
import { createBoard } from '../src/game';
import { applyManaReward, manaReward, patternRewards } from '../src/patterns';

describe('M1 pattern Mana rules', () => {
  it('awards 1 Mana for a newly formed three-line', () => {
    const board = createBoard();
    board[4][2] = board[4][3] = board[4][4] = 1;
    expect(manaReward(board, { row: 4, col: 4 }, 1)).toBe(1);
  });

  it('awards 2 Mana for a newly formed four-line', () => {
    const board = createBoard();
    for (let col = 2; col <= 5; col++) board[4][col] = 1;
    expect(manaReward(board, { row: 4, col: 5 }, 1)).toBe(2);
  });

  it('stacks rewards when one placement creates multiple lines', () => {
    const board = createBoard();
    board[4][3] = board[4][4] = board[4][5] = 1;
    board[3][4] = board[5][4] = 1;
    expect(patternRewards(board, { row: 4, col: 4 }, 1)).toHaveLength(2);
    expect(manaReward(board, { row: 4, col: 4 }, 1)).toBe(2);
  });

  it('does not reward a five-line because the match is already won', () => {
    const board = createBoard();
    for (let col = 1; col <= 5; col++) board[4][col] = 1;
    expect(manaReward(board, { row: 4, col: 5 }, 1)).toBe(0);
  });

  it('caps Mana at 5', () => {
    expect(applyManaReward(4, 3)).toBe(5);
  });
});
