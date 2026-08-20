import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { chooseCpuAction } from '../src/runtime/cpu-action-evaluator';

describe('M7 immediate threat priority',()=>{
 it('takes a CPU win even when player also threatens mate',()=>{const board=createBoard();for(let c=0;c<4;c++){board[1][c]=2;board[3][c]=1;}const state=createCombatState(board);expect(chooseCpuAction(state,[{kind:'place',at:{row:3,col:4}},{kind:'place',at:{row:1,col:4}}])?.action).toEqual({kind:'place',at:{row:1,col:4}});});
});
