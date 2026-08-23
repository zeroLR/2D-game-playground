import { describe,expect,it,vi } from 'vitest';
import { setAbilityResource,getAbilityResource } from '../src/ability-economy';
import { createBoard } from '../src/game';
import { createCombatState } from '../src/combat';
import { cpuActionCandidates,resolveCpuTurn } from '../src/runtime/cpu-runtime';

/** M7 allows bounded Top-K imperfection at the baseline. Legacy tactical tests assert the best action, so pin RNG to the optimal branch. */
function resolveOptimalCpuTurn(...args:Parameters<typeof resolveCpuTurn>){const random=vi.spyOn(Math,'random').mockReturnValue(0);try{return resolveCpuTurn(...args);}finally{random.mockRestore();}}
function withCpuPressure(state:ReturnType<typeof createCombatState>,pressure:number){return setAbilityResource(state,2,'pressure',pressure);}

describe('Shade Pressure CPU',()=>{
 it('only generates Corrupt candidates for Shade at full Pressure',()=>{const board=createBoard();board[4][4]=2;board[4][5]=1;const state=withCpuPressure(createCombatState(board),3);expect(cpuActionCandidates(state,'shade').some((a)=>a.kind==='skill'&&a.skillId==='corrupt')).toBe(true);expect(cpuActionCandidates(state,'vanguard').some((a)=>a.kind==='skill'&&a.skillId==='corrupt')).toBe(false);expect(cpuActionCandidates(state,'arcanist').some((a)=>a.kind==='skill'&&a.skillId==='corrupt')).toBe(false);});
 it('does not generate Corrupt below its Pressure cost',()=>{const board=createBoard();board[4][4]=2;board[4][5]=1;const state=withCpuPressure(createCombatState(board),2);expect(cpuActionCandidates(state,'shade').some((a)=>a.kind==='skill'&&a.skillId==='corrupt')).toBe(false);});
 it('uses Corrupt to dismantle a high-value player structure and spends Pressure',()=>{const board=createBoard();board[4][2]=1;board[4][3]=1;board[4][4]=1;board[3][3]=2;const state=withCpuPressure(createCombatState(board),3);const result=resolveOptimalCpuTurn(state,'shade');expect(result.action?.kind).toBe('skill');if(result.action?.kind==='skill'){expect(result.action.skillId).toBe('corrupt');expect(result.action.target).toEqual({row:4,col:3});expect(result.state.board[4][3]).toBe(0);}expect(getAbilityResource(result.state,2,'pressure')).toBe(0);});
 it('keeps Pressure when ordinary placement is more valuable than Corrupt',()=>{const board=createBoard();board[4][1]=2;board[4][2]=2;board[4][3]=2;board[2][2]=1;board[3][2]=2;const state=withCpuPressure(createCombatState(board),3);const result=resolveOptimalCpuTurn(state,'shade');expect(result.action?.kind).toBe('place');expect(getAbilityResource(result.state,2,'pressure')).toBeGreaterThanOrEqual(3);});
});
