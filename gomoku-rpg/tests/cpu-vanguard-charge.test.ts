import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState,setMana } from '../src/combat';
import { cpuActionCandidates,resolveCpuTurn } from '../src/runtime/cpu-runtime';
import { randomCpuHero } from '../src/runtime/match-runtime';

describe('M2.5 Slice 2 CPU Vanguard Charge',()=>{
 it('only generates Charge candidates for Vanguard with enough Mana',()=>{const board=createBoard();board[4][4]=2;const state=setMana(createCombatState(board),2,3);expect(cpuActionCandidates(state,'vanguard').some((a)=>a.kind==='skill'&&a.skillId==='charge')).toBe(true);expect(cpuActionCandidates(state,'arcanist').some((a)=>a.kind==='skill'&&a.skillId==='charge')).toBe(false);expect(cpuActionCandidates(state,'shade').some((a)=>a.kind==='skill'&&a.skillId==='charge')).toBe(false);expect(cpuActionCandidates(state,'architect').some((a)=>a.kind==='skill'&&a.skillId==='charge')).toBe(false);});
 it('does not generate Charge below its Mana cost even when another equipped skill is affordable',()=>{const board=createBoard();board[4][4]=2;const state=setMana(createCombatState(board),2,2);const candidates=cpuActionCandidates(state,'vanguard');expect(candidates.some((a)=>a.kind==='skill'&&a.skillId==='charge')).toBe(false);expect(candidates.some((a)=>a.kind==='skill'&&a.skillId==='blink')).toBe(true);});
 it('uses Charge when pushing an enemy stone creates an immediate win',()=>{const board=createBoard();board[4][0]=2;board[4][1]=2;board[4][2]=2;board[4][3]=2;board[4][4]=1;board[5][4]=2;const state=setMana(createCombatState(board),2,3);const result=resolveCpuTurn(state,'vanguard');expect(result.action?.kind).toBe('skill');if(result.action?.kind==='skill'){expect(result.action.skillId).toBe('charge');expect(result.action.target).toEqual({row:4,col:4});}expect(result.outcome).toBe('won');expect(result.state.resources[2].mana).toBe(0);});
 it('never exposes Charge to a non-Vanguard CPU',()=>{const board=createBoard();board[4][4]=2;const state=setMana(createCombatState(board),2,5);for(const hero of ['arcanist','shade','architect'] as const){const candidates=cpuActionCandidates(state,hero);expect(candidates.some((a)=>a.kind==='skill'&&a.skillId==='charge')).toBe(false);const result=resolveCpuTurn(state,hero);if(result.action?.kind==='skill')expect(result.action.skillId).not.toBe('charge');}});
 it('supports deterministic CPU hero selection for the expanded roster',()=>{expect(randomCpuHero(()=>0)).toBe('vanguard');expect(randomCpuHero(()=>0.99)).toBe('architect');});
});
