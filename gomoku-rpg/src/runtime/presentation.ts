import { canActivate, getAbilityCooldown, getAbilityResource, legacyManaCost, type AbilityActivationRule } from '../ability-economy';
import { resolveAbilityActionTiming, type AbilityActionTiming } from '../action-timing';
import { Player } from '../game';
import { CombatState } from '../combat';
import { HeroId, Loadout, heroes } from '../heroes';
import { prepareHeroAbilityState, resolveAbilityActivation } from '../hero-ability-activation';
import { SkillId } from '../skills';
import { SkillTargetingState, targetingSkill } from './targeting';
import { TurnState, isPlayerInput } from './turn-runtime';

export interface SkillBarItem{skillId:SkillId;cost:number;enabled:boolean;selected:boolean;descriptionKey:string;activation:AbilityActivationRule;actionTiming:AbilityActionTiming;cooldownRemaining:number;resourceCurrent:number;resourceMax:number;conditionReady:boolean;}

export function describeSkillBar(state:CombatState,player:Player,heroId:HeroId,loadout:Loadout,turn:TurnState,targeting:SkillTargetingState,followUpOpen=false,pendingTechnique:SkillId|null=null,techniqueResolutionOpen=false):SkillBarItem[]{
  const active=targetingSkill(targeting),economy=heroes[heroId].abilityEconomy;
  return loadout.skillIds.map((skillId)=>{
    const activation=resolveAbilityActivation(heroId,skillId),actionTiming=resolveAbilityActionTiming(heroId,skillId),prepared=prepareHeroAbilityState(state,heroId,player,skillId),readiness=canActivate(prepared,player,activation,skillId);
    const resourceId=activation.kind==='resource'?activation.resourceId:null,economyResourceId=economy.kind==='resource'||economy.kind==='momentum'?economy.resourceId:null,economyMax=economy.kind==='resource'||economy.kind==='momentum'?economy.max:0;
    const timingReady=actionTiming==='primary'?(!followUpOpen&&!techniqueResolutionOpen&&pendingTechnique===null):actionTiming==='precommit-follow-up'?(techniqueResolutionOpen?active===skillId:!followUpOpen):followUpOpen;
    return {skillId,cost:legacyManaCost(activation),enabled:isPlayerInput(turn)&&timingReady&&readiness.ready,selected:active===skillId||pendingTechnique===skillId,descriptionKey:`${skillId}Help`,activation,actionTiming,cooldownRemaining:activation.kind==='cooldown'?getAbilityCooldown(prepared,player,skillId):0,resourceCurrent:resourceId?getAbilityResource(prepared,player,resourceId):0,resourceMax:resourceId===economyResourceId?economyMax:0,conditionReady:activation.kind==='condition'&&readiness.ready};
  });
}

export type StatusKey='yourTurn'|'followUp'|'opponentTurn'|'selectDestination'|'victory'|'defeat'|'draw'|SkillId;
export function statusKey(turn:TurnState,targeting:SkillTargetingState,followUpOpen=false,pendingTechnique:SkillId|null=null):StatusKey{if(turn.status!=='playing')return turn.status;if(turn.phase==='cpu')return 'opponentTurn';if(targeting.mode==='select-target'&&targeting.source)return 'selectDestination';return targetingSkill(targeting)??pendingTechnique??(followUpOpen?'followUp':'yourTurn');}
