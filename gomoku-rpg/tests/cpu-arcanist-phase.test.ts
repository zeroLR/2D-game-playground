import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState,getMana,isSealed,setMana } from '../src/combat';
import { cpuActionCandidates,resolveCpuTurn } from '../src/runtime/cpu-runtime';

describe('M2.5 Slice 3 CPU Arcanist Phase',()=>{
 it('only generates Phase candidates for Arcanist with enough Mana',()=>{const board=createBoard();board[4][4]=2;const state=setMana(createCombatState(board),2,2);expect(cpuActionCandidates(state,'arcanist').some((a)=>a.kind==='skill'&&a.skillId==='phase')).toBe(true);expect(cpuActionCandidates(state,'vanguard').some((a)=>a.kind==='skill'&&a.skillId==='phase')).toBe(false);expect(cpuActionCandidates(state,'shade').some((a)=>a.kind==='skill')).toBe(false);});
 it('does not generate Phase below its Mana cost',()=>{const board=createBoard();board[4][4]=2;const state=setMana(createCombatState(board),2,1);expect(cpuActionCandidates(state,'arcanist').some((a)=>a.kind==='skill')).toBe(false);});
 it('uses Phase when repositioning creates a materially stronger tactical structure',()=>{const board=createBoard();board[4][1]=2;board[4][2]=2;board[4][3]=2;board[5][4]=2;const state=setMana(createCombatState(board),2,2);const result=resolveCpuTurn(state,'arcanist');expect(result.action?.kind).toBe('skill');if(result.action?.kind==='skill'){expect(result.action.skillId).toBe('phase');expect(result.action.source).toEqual({row:5,col:4});expect(result.action.target).toEqual({row:4,col:4});}expect(result.state.board[5][4]).toBe(0);expect(result.state.board[4][4]).toBe(2);expect(isSealed(result.state,{row:5,col:4})).toBe(true);expect(result.passiveTriggered).toBe(true);expect(getMana(result.state,2)).toBe(1);});
 it('keeps Phase hero-specific instead of exposing it to Vanguard',()=>{const board=createBoard();board[4][1]=2;board[4][2]=2;board[4][3]=2;board[5][4]=2;const state=setMana(createCombatState(board),2,3);const result=resolveCpuTurn(state,'vanguard');if(result.action?.kind==='skill')expect(result.action.skillId).not.toBe('phase');});
});
