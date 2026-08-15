import { describe, expect, it } from 'vitest';
import { executePlace } from '../src/combat';
import { createBoard } from '../src/game';
import { blinkSkill, isLegalPosition } from '../src/skills';

describe('M1 turn action model', () => {
  it('a valid placement consumes exactly one turn action and grants pattern Mana', () => {
    const board=createBoard(); board[4][2]=board[4][3]=1;
    const result=executePlace({board,mana:0,activePlayer:1},{kind:'place',at:{row:4,col:4}});
    expect(result.ok).toBe(true);
    expect(result.consumedTurn).toBe(true);
    expect(result.manaGained).toBe(1);
    expect(result.state.mana).toBe(1);
  });

  it('an invalid placement does not consume the turn', () => {
    const board=createBoard(); board[4][4]=2;
    const result=executePlace({board,mana:0,activePlayer:1},{kind:'place',at:{row:4,col:4}});
    expect(result.ok).toBe(false);
    expect(result.consumedTurn).toBe(false);
  });
});

describe('M1 skill framework', () => {
  it('Blink exposes friendly sources and empty destinations', () => {
    const board=createBoard(); board[4][4]=1; board[3][3]=2;
    const context={board,player:1 as const,mana:2};
    const sources=blinkSkill.legalSources?.(context)??[];
    expect(isLegalPosition({row:4,col:4},sources)).toBe(true);
    const targets=blinkSkill.legalTargets(context,{row:4,col:4});
    expect(isLegalPosition({row:3,col:3},targets)).toBe(false);
    expect(isLegalPosition({row:0,col:0},targets)).toBe(true);
  });

  it('Blink moves the stone without mutating the original board', () => {
    const board=createBoard(); board[4][4]=1;
    const next=blinkSkill.execute({board,player:1,mana:2},{row:5,col:5},{row:4,col:4});
    expect(board[4][4]).toBe(1);
    expect(next[4][4]).toBe(0);
    expect(next[5][5]).toBe(1);
  });
});