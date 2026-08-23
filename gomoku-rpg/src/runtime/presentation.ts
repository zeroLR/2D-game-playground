import { canActivate, getAbilityCooldown, legacyManaCost, type AbilityActivationRule } from '../ability-economy';
import { Player } from '../game';
import { CombatState } from '../combat';
import { HeroId, Loadout } from '../heroes';
import { resolveAbilityActivation } from '../hero-ability-activation';
import { SkillId, skills } from '../skills';
import { SkillTargetingState, targetingSkill } from './targeting';
import { TurnState, isPlayerInput } from './turn-runtime';

export interface SkillBarItem{skillId:SkillId;cost:number;enabled:boolean;selected:boolean;descriptionKey:string;activation:AbilityActivationRule;cooldownRemaining:number;}

export function describeSkillBar(state:CombatState,player:Player,heroId:HeroId,loadout:Loadout,turn:TurnState,targeting:SkillTargetingState):SkillBarItem[]{
  const active=targetingSkill(targeting);
  return loadout.skillIds.map((skillId)=>{
    const skill=skills[skillId],activation=resolveAbilityActivation(heroId,skillId),readiness=canActivate(state,player,activation,skillId);
    return {skillId,cost:legacyManaCost(activation),enabled:isPlayerInput(turn)&&readiness.ready,selected:active===skillId,descriptionKey:skill.descriptionKey,activation,cooldownRemaining:activation.kind==='cooldown'?getAbilityCooldown(state,player,skillId):0};
  });
}

export type StatusKey='yourTurn'|'opponentTurn'|'selectDestination'|'victory'|'defeat'|'draw'|SkillId;
export function statusKey(turn:TurnState,targeting:SkillTargetingState):StatusKey{if(turn.status!=='playing')return turn.status;if(turn.phase==='cpu')return 'opponentTurn';if(targeting.mode==='select-target'&&targeting.source)return 'selectDestination';return targetingSkill(targeting)??'yourTurn';}
