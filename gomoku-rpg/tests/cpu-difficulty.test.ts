import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { chooseCpuAction } from '../src/runtime/cpu-action-evaluator';
import { CPU_BASELINE_LEVEL,cpuDifficulty } from '../src/runtime/cpu-difficulty';

describe('M7 CPU difficulty foundation',()=>{
 it('keeps the current CPU policy at level 3 baseline',()=>{const p=cpuDifficulty();expect(p.level).toBe(CPU_BASELINE_LEVEL);expect(p.searchDepth).toBe(1);expect(p.candidateWidth).toBe(4);});
 it('interpolates levels and clamps the public 1-20 range',()=>{expect(cpuDifficulty(-5).level).toBe(1);expect(cpuDifficulty(99).level).toBe(20);const p=cpuDifficulty(6);expect(p.level).toBe(6);expect(p.candidateWidth).toBeGreaterThanOrEqual(cpuDifficulty(5).candidateWidth);expect(p.optimalMoveRate).toBeGreaterThan(cpuDifficulty(5).optimalMoveRate);});
 it('never randomizes away an immediate win through the blunder gate',()=>{const board=createBoard();board[4][1]=2;board[4][2]=2;board[4][3]=2;board[4][4]=2;const state=createCombatState(board),win={kind:'place',at:{row:4,col:5}} as const,quiet={kind:'place',at:{row:0,col:0}} as const;const picked=chooseCpuAction(state,[quiet,win],cpuDifficulty(1),()=>.99);expect(picked?.action).toEqual(win);expect(picked?.regret).toBe(0);});
 it('reports decision regret as telemetry-ready metadata',()=>{const state=createCombatState(createBoard()),center={kind:'place',at:{row:4,col:4}} as const,corner={kind:'place',at:{row:0,col:0}} as const;const profile={...cpuDifficulty(1),optimalMoveRate:0,blunderTolerance:1,candidateWidth:2};const picked=chooseCpuAction(state,[center,corner],profile,()=>.99);expect(picked?.bestScore).toBeGreaterThanOrEqual(picked?.score??0);expect(picked?.regret).toBe((picked?.bestScore??0)-(picked?.score??0));});
});
