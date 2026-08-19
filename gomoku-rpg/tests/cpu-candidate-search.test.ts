import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { cpuDifficulty } from '../src/runtime/cpu-difficulty';
import { candidateSearchBonus,searchCpuPlaceCandidates } from '../src/runtime/cpu-candidate-search';

describe('M7.1 candidate search',()=>{
 it('prunes the board to the configured candidate width',()=>{const board=createBoard();board[4][4]=2;board[5][5]=1;const result=searchCpuPlaceCandidates(createCombatState(board),cpuDifficulty(5));expect(result.length).toBeLessThanOrEqual(cpuDifficulty(5).candidateWidth);expect(result.length).toBeGreaterThan(0);});
 it('keeps response search disabled below Lv5',()=>{const board=createBoard();board[4][4]=2;const state=createCombatState(board);expect(candidateSearchBonus(state,{row:4,col:5},cpuDifficulty(4))).toBe(0);});
 it('penalizes a candidate whose opponent response creates an immediate win',()=>{const board=createBoard();board[4][2]=1;board[4][3]=1;board[4][4]=1;board[4][5]=1;board[5][5]=2;const state=createCombatState(board),profile=cpuDifficulty(5);const searched=searchCpuPlaceCandidates(state,profile);const unsafe=searched.find(x=>x.at.row!==4||x.at.col!==1&&x.at.col!==6);const blocking=searched.find(x=>x.at.row===4&&(x.at.col===1||x.at.col===6));expect(blocking).toBeDefined();if(unsafe)expect(blocking!.score).toBeGreaterThan(unsafe.score);});
 it('returns deterministic ranking for the same board and profile',()=>{const board=createBoard();board[4][4]=2;board[4][5]=2;board[5][4]=1;const state=createCombatState(board),profile=cpuDifficulty(6);expect(searchCpuPlaceCandidates(state,profile)).toEqual(searchCpuPlaceCandidates(state,profile));});
});
