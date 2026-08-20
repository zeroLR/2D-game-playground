import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { chooseCpuAction } from '../src/runtime/cpu-action-evaluator';
import { cpuDifficulty } from '../src/runtime/cpu-difficulty';

describe('M7 tactical selection order',()=>{
 it('chooses immediate win above immediate block even when heuristic score favors defense',()=>{const board=createBoard();board[2][0]=2;board[2][1]=2;board[2][2]=2;board[2][3]=2;board[5][0]=1;board[5][1]=1;board[5][2]=1;board[5][3]=1;const state=createCombatState(board),profile=cpuDifficulty(4);const win={kind:'place',at:{row:2,col:4}} as const,block={kind:'place',at:{row:5,col:4}} as const;expect(chooseCpuAction(state,[block,win],profile,()=>1)?.action).toEqual(win);});
});
