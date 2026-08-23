import type { Player } from './game';

export type AbilityStateKey=string;
export type ActorAbilityState={
  resources:Record<AbilityStateKey,number>;
  cooldowns:Record<AbilityStateKey,number>;
  conditions:Record<AbilityStateKey,boolean>;
  charges:Record<AbilityStateKey,number>;
  usesSpent:Record<AbilityStateKey,number>;
};
export type AbilityStates=Record<Player,ActorAbilityState>;

export const createActorAbilityState=():ActorAbilityState=>({resources:{},cooldowns:{},conditions:{},charges:{},usesSpent:{}});
export const createAbilityStates=():AbilityStates=>({1:createActorAbilityState(),2:createActorAbilityState()});

export function updateActorAbilityState(states:AbilityStates,player:Player,update:(state:ActorAbilityState)=>ActorAbilityState):AbilityStates{
  return {...states,[player]:update(states[player])};
}
