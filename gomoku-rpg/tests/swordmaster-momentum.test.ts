import { describe,expect,it } from 'vitest';
import { getAbilityResource,setAbilityResource } from '../src/ability-economy';
import { createCombatState } from '../src/combat';
import { createBoard } from '../src/game';
import { createLoadout,heroes } from '../src/heroes';
import { resolveAbilityActivation } from '../src/hero-ability-activation';
import { resolvePlaceAction,resolveSkillAction } from '../src/runtime/action-resolution';
import { cpuActionCandidates } from '../src/runtime/cpu-runtime';

describe('Swordmaster Momentum economy',()=>{
 it('defines the offensive momentum kit and hero-aware activations',()=>{
  expect(heroes.swordmaster.abilityEconomy).toEqual({kind:'momentum',resourceId:'momentum',max:3});
  expect(createLoadout('swordmaster').skillIds).toEqual(['step','sever']);
  expect(resolveAbilityActivation('swordmaster','step')).toEqual({kind:'resource',resourceId:'momentum',amount:1});
  expect(resolveAbilityActivation('swordmaster','sever')).toEqual({kind:'resource',resourceId:'momentum',amount:3});
  expect(resolveAbilityActivation('swordmaster','blink')).toEqual({kind:'resource',resourceId:'momentum',amount:2});
 });
 it('gains Momentum from 3/4-line attack patterns instead of Mana',()=>{
  const board=createBoard();board[4][2]=board[4][3]=1;
  const first=resolvePlaceAction(createCombatState(board),'swordmaster',1,{row:4,col:4});
  expect(first.ok).toBe(true);expect(first.manaGained).toBe(0);expect(getAbilityResource(first.state,1,'momentum')).toBe(1);
  const second=resolvePlaceAction(first.state,'swordmaster',1,{row:4,col:5});
  expect(second.ok).toBe(true);expect(getAbilityResource(second.state,1,'momentum')).toBe(3);
 });
 it('decays one Momentum on a quiet placement',()=>{
  let state=setAbilityResource(createCombatState(createBoard()),1,'momentum',2);
  const result=resolvePlaceAction(state,'swordmaster',1,{row:0,col:0});
  expect(result.ok).toBe(true);expect(getAbilityResource(result.state,1,'momentum')).toBe(1);
 });
 it('Step spends 1 Momentum to reposition one adjacent stone',()=>{
  const board=createBoard();board[4][4]=1;
  let state=setAbilityResource(createCombatState(board),1,'momentum',1);
  const result=resolveSkillAction(state,'swordmaster',1,'step',{row:4,col:5},{row:4,col:4});
  expect(result.ok).toBe(true);expect(result.state.board[4][4]).toBe(0);expect(result.state.board[4][5]).toBe(1);expect(getAbilityResource(result.state,1,'momentum')).toBe(0);
 });
 it('Sever is a full-Momentum finisher that pushes rather than removes',()=>{
  const board=createBoard();board[4][3]=1;board[4][4]=2;
  let state=setAbilityResource(createCombatState(board),1,'momentum',2);
  expect(resolveSkillAction(state,'swordmaster',1,'sever',{row:4,col:4},{row:4,col:3}).ok).toBe(false);
  state=setAbilityResource(state,1,'momentum',3);
  const result=resolveSkillAction(state,'swordmaster',1,'sever',{row:4,col:4},{row:4,col:3});
  expect(result.ok).toBe(true);expect(result.state.board[4][4]).toBe(0);expect(result.state.board[4][5]).toBe(2);expect(getAbilityResource(result.state,1,'momentum')).toBe(0);
 });
 it('CPU only generates Sever when Momentum is full',()=>{
  const board=createBoard();board[4][3]=2;board[4][4]=1;
  let state=setAbilityResource(createCombatState(board),2,'momentum',2);
  expect(cpuActionCandidates(state,'swordmaster').some(a=>a.kind==='skill'&&a.skillId==='sever')).toBe(false);
  state=setAbilityResource(state,2,'momentum',3);
  expect(cpuActionCandidates(state,'swordmaster').some(a=>a.kind==='skill'&&a.skillId==='sever')).toBe(true);
 });
});
