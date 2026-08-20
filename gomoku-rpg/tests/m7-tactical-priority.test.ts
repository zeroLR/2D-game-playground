import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { chooseCpuAction } from '../src/runtime/cpu-action-evaluator';
import { cpuDifficulty } from '../src/runtime/cpu-difficulty';
import { cpuPlaceCandidates } from '../src/runtime/cpu-runtime';

describe('M7 tactical priority',()=>{
 it('takes its own win before blocking the player',()=>{const board=createBoard();board[2][0]=2;board[2][1]=2;board[2][2]=2;board[2][3]=2;board[5][0]=1;board[5][1]=1;board[5][2]=1;board[5][3]=1;const state=createCombatState(board);expect(chooseCpuAction(state,cpuPlaceCandidates(state),cpuDifficulty(4),()=>0.999)?.action).toEqual({kind:'place',at:{row:2,col:4}});});
});
