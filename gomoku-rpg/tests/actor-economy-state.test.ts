import { describe,expect,it } from 'vitest';
import { canActivate,consumeActivation,getAbilityCooldown,getAbilityResource,getAbilityUsesSpent,setAbilityCondition,setAbilityResource } from '../src/ability-economy';
import { createCombatState } from '../src/combat';
import { createBoard } from '../src/game';
import { advanceTurn } from '../src/runtime/turn-runtime';

describe('Hero Ability System v2 actor economy state',()=>{
 it('stores non-Mana resources independently per actor while preserving Mana adapter',()=>{
  let state=createCombatState(createBoard(),2);
  state=setAbilityResource(state,1,'pressure',3);
  state=setAbilityResource(state,2,'pressure',1);
  expect(getAbilityResource(state,1,'mana')).toBe(2);
  expect(getAbilityResource(state,1,'pressure')).toBe(3);
  expect(getAbilityResource(state,2,'pressure')).toBe(1);
 });

 it('starts and advances a cooldown by the owning actor turn',()=>{
  let state=createCombatState(createBoard());
  const rule={kind:'cooldown',turns:3} as const;
  expect(canActivate(state,1,rule,'charge')).toEqual({ready:true});
  state=consumeActivation(state,1,rule,'charge');
  expect(getAbilityCooldown(state,1,'charge')).toBe(3);
  expect(canActivate(state,1,rule,'charge')).toEqual({ready:false,reason:'cooldown'});
  state=advanceTurn(state,2);
  expect(getAbilityCooldown(state,1,'charge')).toBe(3);
  state=advanceTurn(state,1);
  expect(getAbilityCooldown(state,1,'charge')).toBe(2);
 });

 it('supports conditional and resource-plus-condition readiness',()=>{
  let state=setAbilityResource(createCombatState(createBoard()),1,'pressure',2);
  const conditional={kind:'condition',conditionId:'formation-ready'} as const;
  const combined={kind:'resource-and-condition',resourceId:'pressure',amount:2,conditionId:'formation-ready'} as const;
  expect(canActivate(state,1,conditional,'lattice')).toEqual({ready:false,reason:'condition'});
  state=setAbilityCondition(state,1,'formation-ready',true);
  expect(canActivate(state,1,conditional,'lattice')).toEqual({ready:true});
  expect(canActivate(state,1,combined,'lattice')).toEqual({ready:true});
  state=consumeActivation(state,1,combined,'lattice');
  expect(getAbilityResource(state,1,'pressure')).toBe(0);
 });

 it('tracks limited uses per ability and per actor',()=>{
  let state=createCombatState(createBoard());
  const rule={kind:'limited-use',uses:1} as const;
  state=consumeActivation(state,1,rule,'ultimate');
  expect(getAbilityUsesSpent(state,1,'ultimate')).toBe(1);
  expect(canActivate(state,1,rule,'ultimate')).toEqual({ready:false,reason:'limited-use'});
  expect(canActivate(state,2,rule,'ultimate')).toEqual({ready:true});
 });
});
