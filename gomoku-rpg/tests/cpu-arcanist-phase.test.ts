import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState,getMana,setMana } from '../src/combat';
import { cpuActionCandidates,resolveCpuTurn } from '../src/runtime/cpu-runtime';
describe('CPU Arcanist Flame prototype',()=>{
 it('only generates Flame candidates for Arcanist with at least 3 Mana',()=>{const state=setMana(createCombatState(createBoard()),2,3);expect(cpuActionCandidates(state,'arcanist').some((a)=>a.kind==='skill'&&a.skillId==='phase')).toBe(true);expect(cpuActionCandidates(state,'vanguard').some((a)=>a.kind==='skill'&&a.skillId==='phase')).toBe(false);expect(cpuActionCandidates(state,'shade').some((a)=>a.kind==='skill')).toBe(false);});
 it('does not generate Flame below its Mana cost',()=>{const state=setMana(createCombatState(createBoard()),2,2);expect(cpuActionCandidates(state,'arcanist').some((a)=>a.kind==='skill')).toBe(false);});
 it('can use Flame to place a stone and create denial zones',()=>{const board=createBoard();board[4][1]=2;board[4][2]=2;const state=setMana(createCombatState(board),2,3);const result=resolveCpuTurn(state,'arcanist');expect(result.action?.kind).toBe('skill');if(result.action?.kind==='skill'){expect(result.action.skillId).toBe('phase');expect(result.state.board[result.action.target.row][result.action.target.col]).toBe(2);expect(result.state.flames.length).toBeGreaterThan(0);}expect(result.passiveTriggered).toBe(true);expect(getMana(result.state,2)).toBe(1);});
 it('keeps Flame hero-specific instead of exposing it to Vanguard',()=>{const state=setMana(createCombatState(createBoard()),2,3);const result=resolveCpuTurn(state,'vanguard');if(result.action?.kind==='skill')expect(result.action.skillId).not.toBe('phase');});
});
