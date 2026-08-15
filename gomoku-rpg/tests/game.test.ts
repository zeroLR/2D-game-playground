import { describe, expect, it } from 'vitest';
import { chooseCpuMove, createBoard, isWin } from '../src/game';
import { manaReward } from '../src/patterns';

describe('core rules',()=>{
 it('wins with five in a row',()=>{const b=createBoard();for(let c=1;c<=5;c++)b[4][c]=1;expect(isWin(b,{row:4,col:5},1)).toBe(true);});
 it('rewards a three-line with one mana',()=>{const b=createBoard();b[3][2]=b[3][3]=b[3][4]=1;expect(manaReward(b,{row:3,col:4},1)).toBe(1);});
 it('CPU blocks an immediate player win',()=>{const b=createBoard();for(let c=1;c<=4;c++)b[4][c]=1;b[4][0]=2;expect(chooseCpuMove(b)).toEqual({row:4,col:5});});
 it('CPU never chooses a cell excluded by combat legality',()=>{const b=createBoard();b[4][1]=b[4][2]=b[4][3]=b[4][4]=2;const sealed={row:4,col:5};const legal=[{row:0,col:0},{row:0,col:1}];const move=chooseCpuMove(b,legal);expect(move).not.toEqual(sealed);expect(legal).toContainEqual(move);});
});