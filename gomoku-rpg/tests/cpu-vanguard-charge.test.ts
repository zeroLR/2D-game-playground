import { describe,expect,it } from 'vitest';
import { createBoard } from '../src/game';
import { createCombatState,setMana } from '../src/combat';
import { cpuActionCandidates,resolveCpuTurn } from '../src/runtime/cpu-runtime';
import { randomCpuHero } from '../src/runtime/match-runtime';

describe('M2.5 Slice 2 CPU Vanguard Charge',()=>{
 it('only generates Charge candidates for Vanguard with enough Mana',()=>{const board=createBoard();board[4][4]=2;const state=setMana(createCombatState(board),2,3);expect(cpuActionCandidates(state,'vanguard').some((a)=>a.kind==='skill'&&a.skillId==='charge')).toBe(true);expect(cpuActionCandidates(state,'shade').some((a)=>a.kind==='skill')).toBe(false);});
 it('does not generate Charge below its Mana cost',()=>{const board=createBoard();board[4][4]=2;const state=setMana(createCombatState(board),2,2);expect(cpuActionCandidates(state,'vanguard').some((a)=>a.kind==='skill')).toBe(false);});
 it('uses Charge when it can disrupt a fork that one ordinary placement cannot answer',()=>{const board=createBoard();board[4][1]=1;board[4][2]=1;board[4][3]=1;board[1][4]=1;board[2][4]=1;board[3][4]=1;board[5][4]=2;const state=setMana(createCombatState(board),2,3);const result=resolveCpuTurn(state,'vanguard');expect(result.action?.kind).toBe('skill');if(result.action?.kind==='skill')expect(result.action.skillId).toBe('charge');expect(result.state.resources[2].mana).toBe(0);});
 it('keeps non-Vanguard CPU on placement actions in this slice',()=>{const board=createBoard();board[4][4]=2;const state=setMana(createCombatState(board),2,5);expect(resolveCpuTurn(state,'arcanist').action?.kind).toBe('place');});
 it('supports deterministic CPU hero selection for runtime tests',()=>{expect(randomCpuHero(()=>0)).toBe('vanguard');expect(randomCpuHero(()=>0.99)).toBe('shade');});
});
