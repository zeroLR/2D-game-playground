import { describe,expect,it } from 'vitest';
import { consumeActivation } from '../src/ability-economy';
import { createBoard } from '../src/game';
import { createCombatState,setMana } from '../src/combat';
import { resolveAbilityActivation } from '../src/hero-ability-activation';
import { cpuActionCandidates,resolveCpuTurn } from '../src/runtime/cpu-runtime';
import { randomCpuHero } from '../src/runtime/match-runtime';

describe('V2 CPU Vanguard cooldown economy',()=>{
 it('generates Charge candidates without requiring Mana',()=>{const board=createBoard();board[4][4]=2;const state=createCombatState(board);expect(cpuActionCandidates(state,'vanguard').some((a)=>a.kind==='skill'&&a.skillId==='charge')).toBe(true);expect(cpuActionCandidates(state,'arcanist').some((a)=>a.kind==='skill'&&a.skillId==='charge')).toBe(false);});
 it('removes Charge candidates while Charge is cooling down without blocking Blink',()=>{const board=createBoard();board[4][4]=2;let state=createCombatState(board);state=consumeActivation(state,2,resolveAbilityActivation('vanguard','charge'),'charge');const candidates=cpuActionCandidates(state,'vanguard');expect(candidates.some((a)=>a.kind==='skill'&&a.skillId==='charge')).toBe(false);expect(candidates.some((a)=>a.kind==='skill'&&a.skillId==='blink')).toBe(true);});
 it('uses Charge when pushing an enemy stone creates an immediate win and leaves Mana untouched',()=>{const board=createBoard();board[4][0]=2;board[4][1]=2;board[4][2]=2;board[4][3]=2;board[4][4]=1;board[5][4]=2;const state=setMana(createCombatState(board),2,3);const result=resolveCpuTurn(state,'vanguard');expect(result.action?.kind).toBe('skill');if(result.action?.kind==='skill'){expect(result.action.skillId).toBe('charge');expect(result.action.target).toEqual({row:4,col:4});}expect(result.outcome).toBe('won');expect(result.state.resources[2].mana).toBe(3);});
 it('never exposes Charge to a non-Vanguard CPU',()=>{const board=createBoard();board[4][4]=2;const state=setMana(createCombatState(board),2,5);for(const hero of ['arcanist','shade','architect'] as const){const candidates=cpuActionCandidates(state,hero);expect(candidates.some((a)=>a.kind==='skill'&&a.skillId==='charge')).toBe(false);const result=resolveCpuTurn(state,hero);if(result.action?.kind==='skill')expect(result.action.skillId).not.toBe('charge');}});
 it('supports deterministic CPU hero selection for the expanded roster',()=>{expect(randomCpuHero(()=>0)).toBe('vanguard');expect(randomCpuHero(()=>0.99)).toBe('architect');});
});
