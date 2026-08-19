import { describe,expect,it,vi } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState,getMana,setMana } from '../src/combat';
import { cpuActionCandidates,resolveCpuTurn } from '../src/runtime/cpu-runtime';

/** M7 allows bounded Top-K imperfection at the baseline. Legacy tactical tests assert the best action, so pin RNG to the optimal branch. */
function resolveOptimalCpuTurn(...args:Parameters<typeof resolveCpuTurn>){const random=vi.spyOn(Math,'random').mockReturnValue(0);try{return resolveCpuTurn(...args);}finally{random.mockRestore();}}

describe('M2.5 Slice 4 CPU Shade Corrupt',()=>{
 it('only generates Corrupt candidates for Shade with at least 3 Mana',()=>{const board=createBoard();board[4][4]=2;board[4][5]=1;const state=setMana(createCombatState(board),2,3);expect(cpuActionCandidates(state,'shade').some((a)=>a.kind==='skill'&&a.skillId==='corrupt')).toBe(true);expect(cpuActionCandidates(state,'vanguard').some((a)=>a.kind==='skill'&&a.skillId==='corrupt')).toBe(false);expect(cpuActionCandidates(state,'arcanist').some((a)=>a.kind==='skill'&&a.skillId==='corrupt')).toBe(false);});
 it('does not generate Corrupt below its Mana cost',()=>{const board=createBoard();board[4][4]=2;board[4][5]=1;const state=setMana(createCombatState(board),2,2);expect(cpuActionCandidates(state,'shade').some((a)=>a.kind==='skill'&&a.skillId==='corrupt')).toBe(false);});
 it('uses Corrupt to dismantle a high-value player structure',()=>{const board=createBoard();board[4][2]=1;board[4][3]=1;board[4][4]=1;board[3][3]=2;const state=setMana(createCombatState(board),2,3);const result=resolveOptimalCpuTurn(state,'shade');expect(result.action?.kind).toBe('skill');if(result.action?.kind==='skill'){expect(result.action.skillId).toBe('corrupt');expect(result.action.target).toEqual({row:4,col:3});expect(result.state.board[4][3]).toBe(0);}expect(getMana(result.state,2)).toBe(0);});
 it('keeps Mana when ordinary placement is more valuable than Corrupt',()=>{const board=createBoard();board[4][1]=2;board[4][2]=2;board[4][3]=2;board[2][2]=1;board[3][2]=2;const state=setMana(createCombatState(board),2,3);const result=resolveOptimalCpuTurn(state,'shade');expect(result.action?.kind).toBe('place');expect(getMana(result.state,2)).toBeGreaterThanOrEqual(3);});
});
