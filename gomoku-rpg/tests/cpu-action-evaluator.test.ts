import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { chooseCpuAction,scoreCpuAction } from '../src/runtime/cpu-action-evaluator';
import { cpuPlaceCandidates } from '../src/runtime/cpu-runtime';

describe('M2.5 CPU action evaluator',()=>{
 it('prefers an immediate CPU win over ordinary placement',()=>{const board=createBoard();board[4][1]=2;board[4][2]=2;board[4][3]=2;board[4][4]=2;const state=createCombatState(board);const win={kind:'place',at:{row:4,col:5}} as const;const quiet={kind:'place',at:{row:0,col:0}} as const;expect(scoreCpuAction(state,win)).toBeGreaterThan(scoreCpuAction(state,quiet));expect(chooseCpuAction(state,[quiet,win])?.action).toEqual(win);});
 it('prefers blocking an immediate player win over a quiet move',()=>{const board=createBoard();board[3][1]=1;board[3][2]=1;board[3][3]=1;board[3][4]=1;const state=createCombatState(board);const block={kind:'place',at:{row:3,col:5}} as const;const quiet={kind:'place',at:{row:0,col:0}} as const;expect(chooseCpuAction(state,[quiet,block])?.action).toEqual(block);});
 it('exposes placement candidates through the unified action shape',()=>{const board=createBoard();board[0][0]=1;const candidates=cpuPlaceCandidates(createCombatState(board));expect(candidates).toHaveLength(80);expect(candidates.every((candidate)=>candidate.kind==='place')).toBe(true);expect(candidates).not.toContainEqual({kind:'place',at:{row:0,col:0}});});
 it('accepts skill candidates without making them competitive before hero scoring slices',()=>{const state=createCombatState(createBoard());const skill={kind:'skill',skillId:'charge',target:{row:4,col:4}} as const;expect(scoreCpuAction(state,skill)).toBe(0);expect(chooseCpuAction(state,[skill,{kind:'place',at:{row:4,col:4}}])?.action.kind).toBe('place');});
});
