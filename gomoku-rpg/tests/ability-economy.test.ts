import { describe,expect,it } from 'vitest';
import { canActivate,consumeActivation,legacyManaCost,type AbilityActivationRule } from '../src/ability-economy';
import { createCombatState,getMana } from '../src/combat';
import { createBoard } from '../src/game';

describe('V2 ability economy activation boundary',()=>{
 it('adapts current Mana activation through a generic resource rule',()=>{
  const activation:AbilityActivationRule={kind:'resource',resourceId:'mana',amount:2};
  const state=createCombatState(createBoard(),2);
  expect(canActivate(state,1,activation)).toEqual({ready:true});
  const next=consumeActivation(state,1,activation);
  expect(getMana(next,1)).toBe(0);
  expect(legacyManaCost(activation)).toBe(2);
 });
 it('reports insufficient resource without mutating state',()=>{
  const activation:AbilityActivationRule={kind:'resource',resourceId:'mana',amount:3};
  const state=createCombatState(createBoard(),2);
  expect(canActivate(state,1,activation)).toEqual({ready:false,reason:'insufficient-resource'});
  expect(consumeActivation(state,1,activation)).toBe(state);
 });
 it('keeps future economy primitives explicit instead of treating them as Mana',()=>{
  const state=createCombatState(createBoard(),5);
  expect(canActivate(state,1,{kind:'cooldown',turns:3})).toEqual({ready:false,reason:'cooldown'});
  expect(canActivate(state,1,{kind:'condition',conditionId:'formation-ready'})).toEqual({ready:false,reason:'condition'});
  expect(legacyManaCost({kind:'cooldown',turns:3})).toBe(0);
 });
});
