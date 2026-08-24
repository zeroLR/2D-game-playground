import { canActivate, getAbilityCooldown, getAbilityResource, legacyManaCost, type AbilityActivationRule } from '../ability-economy';
import { resolveAbilityActionTiming, type AbilityActionTiming } from '../action-timing';
import { Player } from '../game';
import { CombatState } from '../combat';
import { HeroId, Loadout, heroes } from '../heroes';
import { prepareHeroAbilityState, resolveAbilityActivation } from '../hero-ability-activation';
import { SkillId, skills } from '../skills';
import { SkillTargetingState, targetingSkill } from './targeting';
import { TurnState, isPlayerInput } from './turn-runtime';

export interface SkillBarItem{skillId:SkillId;cost:number;enabled:boolean;selected:boolean;descriptionKey:string;activation:AbilityActivationRule;actionTiming:AbilityActionTiming;cooldownRemaining:number;resourceCurrent:number;resourceMax:number;conditionReady:boolean;}

export function describeSkillBar(state:CombatState,player:Player,heroId:HeroId,loadout:Loadout,turn:TurnState,targeting:SkillTargetingState,followUpOpen=false):SkillBarItem[]{
  const active=targetingSkill(targeting),economy=heroes[heroId].abilityEconomy;
  return loadout.skillIds.map((skillId)=>{
    const skill=skills[skillId],activation=resolveAbilityActivation(heroId,skillId),actionTiming=resolveAbilityActionTiming(heroId,skillId),prepared=prepareHeroAbilityState(state,heroId,player,skillId),readiness=canActivate(prepared,player,activation,skillId);
    const resourceId=activation.kind==='resource'?activation.resourceId:null;
    const economyResourceId=economy.kind==='resource'||economy.kind==='momentum'?economy.resourceId:null;
    const economyMax=economy.kind==='resource'||economy.kind==='momentum'?economy.max:0;
    const timingReady=followUpOpen?actionTiming==='follow-up':actionTiming==='primary';
    return {skillId,cost:legacyManaCost(activation),enabled:isPlayerInput(turn)&&timingReady&&readiness.ready,selected:active===skillId,descriptionKey:skill.descriptionKey,activation,actionTiming,cooldownRemaining:activation.kind==='cooldown'?getAbilityCooldown(prepared,player,skillId):0,resourceCurrent:resourceId?getAbilityResource(prepared,player,resourceId):0,resourceMax:resourceId===economyResourceId?economyMax:0,conditionReady:activation.kind==='condition'&&readiness.ready};
  });
}

export type StatusKey='yourTurn'|'followUp'|'opponentTurn'|'selectDestination'|'victory'|'defeat'|'draw'|SkillId;
export function statusKey(turn:TurnState,targeting:SkillTargetingState,followUpOpen=false):StatusKey{if(turn.status!=='playing')return turn.status;if(turn.phase==='cpu')return 'opponentTurn';if(targeting.mode==='select-target'&&targeting.source)return 'selectDestination';return targetingSkill(targeting)??(followUpOpen?'followUp':'yourTurn');}
