import { canActivate } from '../ability-economy';
import { Pos } from '../game';
import { CombatState, forcedPlacementFor, getMana, isSealed, samePos } from '../combat';
import { HeroId, Loadout, createLoadout } from '../heroes';
import { SkillId, skills } from '../skills';
import { resolvePlaceAction, resolveSkillAction } from './action-resolution';
import { CpuAction, CpuDecisionCandidate, chooseCpuAction } from './cpu-action-evaluator';
import { CPU_BASELINE_LEVEL, cpuDifficulty } from './cpu-difficulty';

export type CpuOutcome='moved'|'won'|'draw'|'blocked';
export interface CpuRuntimePolicy{skillsEnabled:boolean;}
export const FULL_CPU_RUNTIME_POLICY:CpuRuntimePolicy={skillsEnabled:true};
export interface CpuResolution{outcome:CpuOutcome;state:CombatState;at:Pos|null;action:CpuAction|null;passiveTriggered:boolean;cpuLevel:number;decisionScore:number|null;decisionBestScore:number|null;decisionRegret:number|null;decisionReason:string|null;topCandidates:CpuDecisionCandidate[];manaBefore:number;}
export function cpuLegalCells(state:CombatState):Pos[]{const forced=forcedPlacementFor(state,2);return state.board.flatMap((row,r)=>row.map((cell,c)=>({cell,pos:{row:r,col:c}}))).filter(({cell,pos})=>cell===0&&!isSealed(state,pos)&&(!forced||samePos(forced,pos))).map(({pos})=>pos);}
export function cpuPlaceCandidates(state:CombatState):CpuAction[]{return cpuLegalCells(state).map((at)=>({kind:'place',at}));}
function cpuSkillCandidates(state:CombatState,skillId:SkillId):CpuAction[]{
 const skill=skills[skillId];
 if(!canActivate(state,2,skill.activation,skillId).ready)return [];
 const context={state,player:2 as const};
 if(skill.legalSources){
  return skill.legalSources(context).flatMap((source)=>skill.legalTargets(context,source).map((target)=>({kind:'skill' as const,skillId,source,target})));
 }
 return skill.legalTargets(context).map((target)=>({kind:'skill' as const,skillId,target}));
}
export function cpuChargeCandidates(state:CombatState):CpuAction[]{return cpuSkillCandidates(state,'charge');}
export function cpuPhaseCandidates(state:CombatState):CpuAction[]{return cpuSkillCandidates(state,'phase');}
export function cpuCorruptCandidates(state:CombatState):CpuAction[]{return cpuSkillCandidates(state,'corrupt');}
export function cpuActionCandidates(state:CombatState,heroId:HeroId,loadoutOrSkillsEnabled:Loadout|boolean=createLoadout(heroId),skillsEnabled=true):CpuAction[]{
 const loadout=typeof loadoutOrSkillsEnabled==='boolean'?createLoadout(heroId):loadoutOrSkillsEnabled;
 const enabled=typeof loadoutOrSkillsEnabled==='boolean'?loadoutOrSkillsEnabled:skillsEnabled;
 return [...cpuPlaceCandidates(state),...(enabled?loadout.skillIds.flatMap((skillId)=>cpuSkillCandidates(state,skillId)):[])];
}

/** CPU actions use the same hero-aware resolution as the player. */
export function resolveCpuTurn(state:CombatState,heroId:HeroId='arcanist',cpuLevel:number=CPU_BASELINE_LEVEL,policy:CpuRuntimePolicy=FULL_CPU_RUNTIME_POLICY,loadout:Loadout=createLoadout(heroId)):CpuResolution{
 const profile=cpuDifficulty(cpuLevel),manaBefore=getMana(state,2),selected=chooseCpuAction(state,cpuActionCandidates(state,heroId,loadout,policy.skillsEnabled),profile);const meta={cpuLevel:profile.level,decisionScore:selected?.score??null,decisionBestScore:selected?.bestScore??null,decisionRegret:selected?.regret??null,decisionReason:selected?.decisionReason??null,topCandidates:selected?.topCandidates??[],manaBefore};if(!selected)return {outcome:'draw',state,at:null,action:null,passiveTriggered:false,...meta};const action=selected.action;
 if(action.kind==='place'){const result=resolvePlaceAction(state,heroId,2,action.at);if(!result.ok)return {outcome:'blocked',state,at:null,action,passiveTriggered:false,...meta};return {outcome:result.won?'won':'moved',state:{...result.state,activePlayer:1},at:action.at,action,passiveTriggered:result.passiveTriggered,...meta};}
 const result=resolveSkillAction(state,heroId,2,action.skillId,action.target,action.source);if(!result.ok)return {outcome:'blocked',state,at:null,action,passiveTriggered:false,...meta};return {outcome:result.won?'won':'moved',state:{...result.state,activePlayer:1},at:action.target,action,passiveTriggered:result.passiveTriggered,...meta};
}
