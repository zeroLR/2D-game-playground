import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { chooseCpuAction } from '../src/runtime/cpu-action-evaluator';
import { cpuDifficulty } from '../src/runtime/cpu-difficulty';

describe('M7 higher-level forced defense',()=>{
 it('Lv6 also blocks immediate loss',()=>{const board=createBoard();board[6][0]=2;board[6][1]=1;board[6][2]=1;board[6][3]=1;board[6][4]=1;const state=createCombatState(board);const candidates=[{kind:'place',at:{row:0,col:0}},{kind:'place',at:{row:6,col:5}}] as const;expect(chooseCpuAction(state,candidates,cpuDifficulty(6),()=>0.999)?.action).toEqual({kind:'place',at:{row:6,col:5}});});
});
