import { describe,expect,it } from 'vitest';
import { BOARD_SIZE } from '../src/game';
import { BOARD_PAD,BOARD_SPAN,BOARD_X,BOARD_Y,cellX,cellY } from '../src/ui/board-view';

describe('R4 board layout',()=>{
 it('keeps the M2 board geometry',()=>{expect([BOARD_X,BOARD_Y,BOARD_SPAN,BOARD_PAD]).toEqual([24,145,342,19]);});
 it('maps the first and last intersection onto the padded grid',()=>{
  expect(cellX(0)).toBe(BOARD_X+BOARD_PAD);
  expect(cellY(0)).toBe(BOARD_Y+BOARD_PAD);
  expect(cellX(BOARD_SIZE-1)).toBe(BOARD_X+BOARD_SPAN-BOARD_PAD);
  expect(cellY(BOARD_SIZE-1)).toBe(BOARD_Y+BOARD_SPAN-BOARD_PAD);
 });
 it('spaces intersections evenly',()=>{const step=cellX(1)-cellX(0);for(let i=1;i<BOARD_SIZE;i++)expect(cellX(i)-cellX(i-1)).toBeCloseTo(step);});
});
