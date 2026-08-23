import { CombatState, getMana, setMana } from './combat';
import type { Player } from './game';

export type ResourceId='mana'|'pressure'|'momentum'|'focus';
export type AbilityEconomyKind='resource'|'cooldown'|'conditional'|'momentum'|'charge'|'limited-use';
export type AbilityConditionId=string;

export type AbilityEconomyDefinition=
 | {kind:'resource';resourceId:ResourceId;max:number}
 | {kind:'cooldown'}
 | {kind:'conditional'}
 | {kind:'momentum';resourceId:ResourceId;max:number}
 | {kind:'charge'}
 | {kind:'limited-use';usesPerMatch:number};

export type AbilityActivationRule=
 | {kind:'resource';resourceId:ResourceId;amount:number}
 | {kind:'cooldown';turns:number}
 | {kind:'condition';conditionId:AbilityConditionId}
 | {kind:'resource-and-condition';resourceId:ResourceId;amount:number;conditionId:AbilityConditionId}
 | {kind:'limited-use';uses:number};

export type ActivationFailureReason='insufficient-resource'|'cooldown'|'condition'|'limited-use'|'unsupported-economy';
export type ActivationReadiness={ready:true}|{ready:false;reason:ActivationFailureReason};

/**
 * V2 activation boundary. The first migration intentionally supports the
 * existing Mana resource as an adapter while non-resource primitives are
 * introduced in later hero-economy slices.
 */
export function canActivate(state:CombatState,player:Player,activation:AbilityActivationRule):ActivationReadiness{
 if(activation.kind==='resource'){
  if(activation.resourceId!=='mana')return {ready:false,reason:'unsupported-economy'};
  return getMana(state,player)>=activation.amount?{ready:true}:{ready:false,reason:'insufficient-resource'};
 }
 if(activation.kind==='resource-and-condition')return {ready:false,reason:'condition'};
 if(activation.kind==='cooldown')return {ready:false,reason:'cooldown'};
 if(activation.kind==='condition')return {ready:false,reason:'condition'};
 return {ready:false,reason:'limited-use'};
}

export function consumeActivation(state:CombatState,player:Player,activation:AbilityActivationRule):CombatState{
 const readiness=canActivate(state,player,activation);
 if(!readiness.ready)return state;
 if(activation.kind==='resource'&&activation.resourceId==='mana')return setMana(state,player,getMana(state,player)-activation.amount);
 return state;
}

/** Compatibility helper for existing Mana-facing telemetry/UI during v2 migration. */
export function legacyManaCost(activation:AbilityActivationRule){
 return activation.kind==='resource'&&activation.resourceId==='mana'?activation.amount:0;
}
