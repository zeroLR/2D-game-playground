import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { chooseCpuAction } from '../src/runtime/cpu-action-evaluator';
import { cpuDifficulty } from '../src/runtime/cpu-difficulty';

describe('M7 forced win',()=>{
 it('cannot randomize away an immediate win',()=>{const board=createBoard();board[1][0]=2;board[1][1]=2;board[1][2]=2;board[1][3]=2;const state=createCombatState(board);const candidates=[{kind:'place',at:{row:8,col:8}},{kind:'place',at:{row:1,col:4}}] as const;expect(chooseCpuAction(state,candidates,cpuDifficulty(4),()=>0.999)?.action).toEqual({kind:'place',at:{row:1,col:4}});});
});
