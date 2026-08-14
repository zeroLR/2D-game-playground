import { describe, expect, it } from 'vitest';
import { chooseCpuMove, createBoard, earnsMana, isWin } from '../src/game';

describe('M0 rules', () => {
  it('wins with five in a row', () => {
    const b=createBoard(); for(let c=1;c<=5;c++) b[4][c]=1;
    expect(isWin(b,{row:4,col:5},1)).toBe(true);
  });
  it('earns mana with three in a row', () => {
    const b=createBoard(); b[3][2]=b[3][3]=b[3][4]=1;
    expect(earnsMana(b,{row:3,col:4},1)).toBe(true);
  });
  it('CPU blocks an immediate player win', () => {
    const b=createBoard(); for(let c=1;c<=4;c++) b[4][c]=1; b[4][0]=2;
    expect(chooseCpuMove(b)).toEqual({row:4,col:5});
  });
});