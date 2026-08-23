import { updateActorAbilityState } from './ability-state';
import { CombatState, getMana, setMana } from './combat';
import type { Player } from './game';

export type ResourceId='mana'|'pressure'|'momentum'|'focus';
export type AbilityEconomyKind='resource'|'cooldown'|'conditional'|'momentum'|'charge'|'limited-use';
export type AbilityConditionId=string;
export type AbilityId=string;

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

export type ActivationFailureReason='insufficient-resource'|'cooldown'|'condition'|'limited-use'|'missing-ability-id';
export type ActivationReadiness={ready:true}|{ready:false;reason:ActivationFailureReason};

export function getAbilityResource(state:CombatState,player:Player,resourceId:ResourceId){
 if(resourceId==='mana')return getMana(state,player);
 return state.abilityStates[player].resources[resourceId]??0;
}

export function setAbilityResource(state:CombatState,player:Player,resourceId:ResourceId,value:number):CombatState{
 if(resourceId==='mana')return setMana(state,player,value);
 return {...state,abilityStates:updateActorAbilityState(state.abilityStates,player,(actor)=>({...actor,resources:{...actor.resources,[resourceId]:Math.max(0,value)}}))};
}

export function setAbilityCondition(state:CombatState,player:Player,conditionId:AbilityConditionId,active:boolean):CombatState{
 return {...state,abilityStates:updateActorAbilityState(state.abilityStates,player,(actor)=>({...actor,conditions:{...actor.conditions,[conditionId]:active}}))};
}

export function getAbilityCooldown(state:CombatState,player:Player,abilityId:AbilityId){return state.abilityStates[player].cooldowns[abilityId]??0;}
export function getAbilityUsesSpent(state:CombatState,player:Player,abilityId:AbilityId){return state.abilityStates[player].usesSpent[abilityId]??0;}

export function canActivate(state:CombatState,player:Player,activation:AbilityActivationRule,abilityId?:AbilityId):ActivationReadiness{
 if(activation.kind==='resource')return getAbilityResource(state,player,activation.resourceId)>=activation.amount?{ready:true}:{ready:false,reason:'insufficient-resource'};
 if(activation.kind==='resource-and-condition'){
  if(!state.abilityStates[player].conditions[activation.conditionId])return {ready:false,reason:'condition'};
  return getAbilityResource(state,player,activation.resourceId)>=activation.amount?{ready:true}:{ready:false,reason:'insufficient-resource'};
 }
 if(activation.kind==='condition')return state.abilityStates[player].conditions[activation.conditionId]?{ready:true}:{ready:false,reason:'condition'};
 if(!abilityId)return {ready:false,reason:'missing-ability-id'};
 if(activation.kind==='cooldown')return getAbilityCooldown(state,player,abilityId)<=0?{ready:true}:{ready:false,reason:'cooldown'};
 return getAbilityUsesSpent(state,player,abilityId)<activation.uses?{ready:true}:{ready:false,reason:'limited-use'};
}

export function consumeActivation(state:CombatState,player:Player,activation:AbilityActivationRule,abilityId?:AbilityId):CombatState{
 const readiness=canActivate(state,player,activation,abilityId);
 if(!readiness.ready)return state;
 if(activation.kind==='resource')return setAbilityResource(state,player,activation.resourceId,getAbilityResource(state,player,activation.resourceId)-activation.amount);
 if(activation.kind==='resource-and-condition')return setAbilityResource(state,player,activation.resourceId,getAbilityResource(state,player,activation.resourceId)-activation.amount);
 if(activation.kind==='cooldown'&&abilityId)return {...state,abilityStates:updateActorAbilityState(state.abilityStates,player,(actor)=>({...actor,cooldowns:{...actor.cooldowns,[abilityId]:activation.turns}}))};
 if(activation.kind==='limited-use'&&abilityId)return {...state,abilityStates:updateActorAbilityState(state.abilityStates,player,(actor)=>({...actor,usesSpent:{...actor.usesSpent,[abilityId]:(actor.usesSpent[abilityId]??0)+1}}))};
 return state;
}

/** Advances turn-based economy state owned by the actor whose turn just ended. */
export function advanceAbilityEconomyAfterTurn(state:CombatState,player:Player):CombatState{
 return {...state,abilityStates:updateActorAbilityState(state.abilityStates,player,(actor)=>({
  ...actor,
  cooldowns:Object.fromEntries(Object.entries(actor.cooldowns).map(([id,remaining])=>[id,Math.max(0,remaining-1)])),
 }))};
}

/** Compatibility helper for existing Mana-facing telemetry/UI during v2 migration. */
export function legacyManaCost(activation:AbilityActivationRule){
 return activation.kind==='resource'&&activation.resourceId==='mana'?activation.amount:activation.kind==='resource-and-condition'&&activation.resourceId==='mana'?activation.amount:0;
}
