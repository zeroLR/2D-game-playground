import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { chooseCpuAction } from '../src/runtime/cpu-action-evaluator';
import { cpuDifficulty } from '../src/runtime/cpu-difficulty';

describe('M7 forced defense candidate width',()=>{
 it('finds forced block from ranked candidates before stochastic selection',()=>{const board=createBoard();board[8][0]=2;for(let c=1;c<=4;c++)board[8][c]=1;const state=createCombatState(board),profile={...cpuDifficulty(4),candidateWidth:1};expect(chooseCpuAction(state,[{kind:'place',at:{row:0,col:0}},{kind:'place',at:{row:8,col:5}}],profile,()=>1)?.action).toEqual({kind:'place',at:{row:8,col:5}});});
});
