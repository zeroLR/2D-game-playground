import { canActivate } from '../ability-economy';
import { resolveAbilityActionTiming, type AbilityActionTiming } from '../action-timing';
import { Pos } from '../game';
import { CombatState, forcedPlacementFor, getMana, isSealed, samePos } from '../combat';
import { HeroId, Loadout, createLoadout } from '../heroes';
import { prepareHeroAbilityState, resolveAbilityActivation } from '../hero-ability-activation';
import { SkillId, skills } from '../skills';
import { resolvePlaceAction, resolveSkillAction } from './action-resolution';
import { CpuAction, CpuDecisionCandidate, chooseCpuAction } from './cpu-action-evaluator';
import { CPU_BASELINE_LEVEL, cpuDifficulty } from './cpu-difficulty';

export type CpuOutcome='moved'|'won'|'draw'|'blocked';
export interface CpuRuntimePolicy{skillsEnabled:boolean;}
export const FULL_CPU_RUNTIME_POLICY:CpuRuntimePolicy={skillsEnabled:true};
export interface CpuResolution{outcome:CpuOutcome;state:CombatState;at:Pos|null;action:CpuAction|null;followUpAction?:CpuAction;followUpAt?:Pos;passiveTriggered:boolean;cpuLevel:number;decisionScore:number|null;decisionBestScore:number|null;decisionRegret:number|null;decisionReason:string|null;topCandidates:CpuDecisionCandidate[];manaBefore:number;}
export function cpuLegalCells(state:CombatState):Pos[]{const forced=forcedPlacementFor(state,2);return state.board.flatMap((row,r)=>row.map((cell,c)=>({cell,pos:{row:r,col:c}}))).filter(({cell,pos})=>cell===0&&!isSealed(state,pos)&&(!forced||samePos(forced,pos))).map(({pos})=>pos);}
export function cpuPlaceCandidates(state:CombatState):CpuAction[]{return cpuLegalCells(state).map((at)=>({kind:'place',at}));}
function cpuSkillCandidates(state:CombatState,heroId:HeroId,skillId:SkillId,timing:'any'|AbilityActionTiming='any'):CpuAction[]{
 if(timing!=='any'&&resolveAbilityActionTiming(heroId,skillId)!==timing)return [];
 const skill=skills[skillId],activation=resolveAbilityActivation(heroId,skillId),prepared=prepareHeroAbilityState(state,heroId,2,skillId);
 if(!canActivate(prepared,2,activation,skillId).ready)return [];
 const context={state:prepared,player:2 as const};
 if(skill.legalSources)return skill.legalSources(context).flatMap((source)=>skill.legalTargets(context,source).map((target)=>({kind:'skill' as const,skillId,source,target})));
 return skill.legalTargets(context).map((target)=>({kind:'skill' as const,skillId,target}));
}
export function cpuChargeCandidates(state:CombatState):CpuAction[]{return cpuSkillCandidates(state,'vanguard','charge');}
export function cpuPhaseCandidates(state:CombatState):CpuAction[]{return cpuSkillCandidates(state,'arcanist','phase');}
export function cpuCorruptCandidates(state:CombatState):CpuAction[]{return cpuSkillCandidates(state,'shade','corrupt');}
export function cpuActionCandidates(state:CombatState,heroId:HeroId,loadoutOrSkillsEnabled:Loadout|boolean=createLoadout(heroId),skillsEnabled=true,timing:'any'|AbilityActionTiming='any'):CpuAction[]{
 const loadout=typeof loadoutOrSkillsEnabled==='boolean'?createLoadout(heroId):loadoutOrSkillsEnabled;
 const enabled=typeof loadoutOrSkillsEnabled==='boolean'?loadoutOrSkillsEnabled:skillsEnabled;
 return [...cpuPlaceCandidates(state),...(enabled?loadout.skillIds.flatMap((skillId)=>cpuSkillCandidates(state,heroId,skillId,timing)):[])];
}
function followUpCandidates(state:CombatState,heroId:HeroId,loadout:Loadout,enabled:boolean){return enabled?loadout.skillIds.flatMap((skillId)=>cpuSkillCandidates(state,heroId,skillId,'follow-up')):[];}
export function resolveCpuTurn(state:CombatState,heroId:HeroId='arcanist',cpuLevel:number=CPU_BASELINE_LEVEL,policy:CpuRuntimePolicy=FULL_CPU_RUNTIME_POLICY,loadout:Loadout=createLoadout(heroId)):CpuResolution{
 const profile=cpuDifficulty(cpuLevel),manaBefore=getMana(state,2),primaryCandidates=[...cpuPlaceCandidates(state),...(policy.skillsEnabled?loadout.skillIds.flatMap((id)=>cpuSkillCandidates(state,heroId,id,'primary')):[])],selected=chooseCpuAction(state,primaryCandidates,profile);const meta={cpuLevel:profile.level,decisionScore:selected?.score??null,decisionBestScore:selected?.bestScore??null,decisionRegret:selected?.regret??null,decisionReason:selected?.decisionReason??null,topCandidates:selected?.topCandidates??[],manaBefore};if(!selected)return {outcome:'draw',state,at:null,action:null,passiveTriggered:false,...meta};const action=selected.action;
 if(action.kind==='place'){
  const placed=resolvePlaceAction(state,heroId,2,action.at);if(!placed.ok)return {outcome:'blocked',state,at:null,action,passiveTriggered:false,...meta};if(placed.won)return {outcome:'won',state:{...placed.state,activePlayer:1},at:action.at,action,passiveTriggered:placed.passiveTriggered,...meta};
  const followSelected=chooseCpuAction(placed.state,followUpCandidates(placed.state,heroId,loadout,policy.skillsEnabled),profile);
  if(!followSelected)return {outcome:'moved',state:{...placed.state,activePlayer:1},at:action.at,action,passiveTriggered:placed.passiveTriggered,...meta};
  const follow=followSelected.action;if(follow.kind!=='skill')return {outcome:'moved',state:{...placed.state,activePlayer:1},at:action.at,action,passiveTriggered:placed.passiveTriggered,...meta};
  const result=resolveSkillAction(placed.state,heroId,2,follow.skillId,follow.target,follow.source);if(!result.ok)return {outcome:'moved',state:{...placed.state,activePlayer:1},at:action.at,action,passiveTriggered:placed.passiveTriggered,...meta};
  return {outcome:result.won?'won':'moved',state:{...result.state,activePlayer:1},at:action.at,action,followUpAction:follow,followUpAt:follow.target,passiveTriggered:placed.passiveTriggered||result.passiveTriggered,...meta};
 }
 const result=resolveSkillAction(state,heroId,2,action.skillId,action.target,action.source);if(!result.ok)return {outcome:'blocked',state,at:null,action,passiveTriggered:false,...meta};return {outcome:result.won?'won':'moved',state:{...result.state,activePlayer:1},at:action.target,action,passiveTriggered:result.passiveTriggered,...meta};
}
