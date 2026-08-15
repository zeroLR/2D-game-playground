import { describe, expect, it } from 'vitest';
import { chooseCpuMove, createBoard, isWin, winningLine } from '../src/game';
import { manaReward } from '../src/patterns';

describe('core rules',()=>{
 it('wins with five in a row',()=>{const b=createBoard();for(let c=1;c<=5;c++)b[4][c]=1;expect(isWin(b,{row:4,col:5},1)).toBe(true);});
 it('returns the contiguous winning cells through the last move',()=>{const b=createBoard();for(let c=1;c<=5;c++)b[4][c]=1;expect(winningLine(b,{row:4,col:3},1)).toEqual([{row:4,col:1},{row:4,col:2},{row:4,col:3},{row:4,col:4},{row:4,col:5}]);});
 it('returns no winning line for a non-winning pattern',()=>{const b=createBoard();b[2][2]=b[3][3]=b[4][4]=1;expect(winningLine(b,{row:3,col:3},1)).toEqual([]);});
 it('rewards a three-line with one mana',()=>{const b=createBoard();b[3][2]=b[3][3]=b[3][4]=1;expect(manaReward(b,{row:3,col:4},1)).toBe(1);});
 it('CPU blocks an immediate player win',()=>{const b=createBoard();for(let c=1;c<=4;c++)b[4][c]=1;b[4][0]=2;expect(chooseCpuMove(b)).toEqual({row:4,col:5});});
 it('CPU takes its own immediate win before blocking',()=>{const b=createBoard();for(let c=1;c<=4;c++){b[2][c]=2;b[6][c]=1;}b[2][0]=1;b[6][0]=2;expect(chooseCpuMove(b)).toEqual({row:2,col:5});});
 it('CPU blocks an open player four before generic central play',()=>{const b=createBoard();b[4][2]=b[4][3]=b[4][4]=1;expect([{row:4,col:1},{row:4,col:5}]).toContainEqual(chooseCpuMove(b));});
 it('CPU builds its own open four when no stronger defense is required',()=>{const b=createBoard();b[3][2]=b[3][3]=b[3][4]=2;b[7][7]=1;expect([{row:3,col:1},{row:3,col:5}]).toContainEqual(chooseCpuMove(b));});
 it('CPU interrupts an open player three instead of blindly taking center',()=>{const b=createBoard();b[2][2]=b[2][3]=b[2][4]=1;b[4][4]=2;const move=chooseCpuMove(b);expect([{row:2,col:1},{row:2,col:5}]).toContainEqual(move);});
 it('CPU never chooses a cell excluded by combat legality',()=>{const b=createBoard();b[4][1]=b[4][2]=b[4][3]=b[4][4]=2;const sealed={row:4,col:5};const legal=[{row:0,col:0},{row:0,col:1}];const move=chooseCpuMove(b,legal);expect(move).not.toEqual(sealed);expect(legal).toContainEqual(move);});
});