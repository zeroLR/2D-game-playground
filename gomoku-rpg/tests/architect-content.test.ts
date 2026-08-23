import { describe,expect,it } from 'vitest';
import { createCombatState,getMana,isSealed,setMana } from '../src/combat';
import { createBoard } from '../src/game';
import { createLoadout,heroes } from '../src/heroes';
import { latticeSkill,rallySkill } from '../src/skills';
import { resolvePlaceAction,resolveSkillAction } from '../src/runtime/action-resolution';
import { scoreCpuAction } from '../src/runtime/cpu-action-evaluator';
import { cpuActionCandidates } from '../src/runtime/cpu-runtime';

describe('Slice 4 Architect identity',()=>{
 it('defines a setup/control hero with two new default skills',()=>{expect(heroes.architect.signaturePassive).toBe('formation');expect(heroes.architect.playstyleTags).toEqual(['setup','control']);expect(heroes.architect.defaultLoadout.skillIds).toEqual(['rally','lattice']);expect(createLoadout('architect',['blink','rally']).skillIds).toEqual(['blink','rally']);});
 it('Formation grants 1 Mana when a placement connects at least two friendly stones',()=>{const board=createBoard();board[4][3]=1;board[3][4]=1;const result=resolvePlaceAction(createCombatState(board),'architect',1,{row:4,col:4});expect(result.ok).toBe(true);if(!result.ok)return;expect(result.passiveTriggered).toBe(true);expect(result.passiveMana).toBe(1);expect(getMana(result.state,1)).toBe(1);});
 it('Formation does not reward an unsupported placement',()=>{const result=resolvePlaceAction(createCombatState(createBoard()),'architect',1,{row:4,col:4});expect(result.ok).toBe(true);if(!result.ok)return;expect(result.passiveTriggered).toBe(false);expect(getMana(result.state,1)).toBe(0);});
});

describe('Slice 4 Architect active skills',()=>{
 it('Rally moves an existing stone only into a formation supported by two other stones',()=>{const board=createBoard();board[0][0]=1;board[4][3]=1;board[3][4]=1;const state=createCombatState(board,2),source={row:0,col:0},target={row:4,col:4};expect(rallySkill.legalTargets({state,player:1},source)).toContainEqual(target);const result=resolveSkillAction(state,'architect',1,'rally',target,source);expect(result.ok).toBe(true);expect(result.state.board[0][0]).toBe(0);expect(result.state.board[4][4]).toBe(1);expect(getMana(result.state,1)).toBe(0);});
 it('Lattice seals the orthogonal empty cells around a friendly anchor',()=>{const board=createBoard();board[4][4]=1;const result=resolveSkillAction(createCombatState(board,3),'architect',1,'lattice',{row:4,col:4});expect(result.ok).toBe(true);for(const pos of [{row:3,col:4},{row:5,col:4},{row:4,col:3},{row:4,col:5}])expect(isSealed(result.state,pos)).toBe(true);expect(getMana(result.state,1)).toBe(0);});
 it('keeps pure effect execution independent from activation spending',()=>{const board=createBoard();board[4][4]=1;const state=createCombatState(board,3);const next=latticeSkill.execute({state,player:1},{row:4,col:4});expect(getMana(next,1)).toBe(3);});
 it('exposes the equipped Architect skills to CPU candidate generation and scoring',()=>{const board=createBoard();board[4][4]=2;board[4][3]=2;board[3][4]=2;board[0][0]=2;const state=setMana(createCombatState(board),2,3),loadout=createLoadout('architect',['rally','lattice']);const candidates=cpuActionCandidates(state,'architect',loadout,true);expect(candidates.some(a=>a.kind==='skill'&&a.skillId==='rally')).toBe(true);expect(candidates.some(a=>a.kind==='skill'&&a.skillId==='lattice')).toBe(true);expect(scoreCpuAction(state,{kind:'skill',skillId:'lattice',target:{row:4,col:4}})).toBeGreaterThan(0);});
});
