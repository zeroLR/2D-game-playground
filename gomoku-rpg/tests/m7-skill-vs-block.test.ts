import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { chooseCpuAction } from '../src/runtime/cpu-action-evaluator';
import { cpuDifficulty } from '../src/runtime/cpu-difficulty';

describe('M7 forced block vs skill',()=>{
 it('blocks an immediate loss before considering a skill',()=>{const board=createBoard();board[4][0]=2;board[4][1]=1;board[4][2]=1;board[4][3]=1;board[4][4]=1;const state=createCombatState(board);const candidates=[{kind:'skill',skillId:'phase',target:{row:8,col:8}},{kind:'place',at:{row:4,col:5}},{kind:'place',at:{row:8,col:8}}] as const;expect(chooseCpuAction(state,candidates,cpuDifficulty(4),()=>0.999)?.action).toEqual({kind:'place',at:{row:4,col:5}});});
});
