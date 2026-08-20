import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { chooseCpuAction } from '../src/runtime/cpu-action-evaluator';
import { cpuDifficulty } from '../src/runtime/cpu-difficulty';

describe('M7 baseline forced defense',()=>{
 it('Lv3 still blocks an immediate loss',()=>{const board=createBoard();board[7][0]=2;board[7][1]=1;board[7][2]=1;board[7][3]=1;board[7][4]=1;const state=createCombatState(board);const candidates=[{kind:'place',at:{row:0,col:0}},{kind:'place',at:{row:7,col:5}}] as const;expect(chooseCpuAction(state,candidates,cpuDifficulty(3),()=>0.999)?.action).toEqual({kind:'place',at:{row:7,col:5}});});
});
