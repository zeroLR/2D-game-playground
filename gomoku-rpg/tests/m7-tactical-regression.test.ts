import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { chooseCpuAction } from '../src/runtime/cpu-action-evaluator';
import { cpuDifficulty } from '../src/runtime/cpu-difficulty';
import { cpuPlaceCandidates } from '../src/runtime/cpu-runtime';

describe('M7 forced defense regression',()=>{
 it('Lv4 blocks a one-ended four on the random-selection path',()=>{const board=createBoard();board[4][0]=2;board[4][1]=1;board[4][2]=1;board[4][3]=1;board[4][4]=1;const state=createCombatState(board);expect(chooseCpuAction(state,cpuPlaceCandidates(state),cpuDifficulty(4),()=>0.999)?.action).toEqual({kind:'place',at:{row:4,col:5}});});
});
