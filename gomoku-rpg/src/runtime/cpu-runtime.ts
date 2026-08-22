import { Pos } from '../game';
import { CombatState, forcedPlacementFor, getMana, isSealed, samePos } from '../combat';
import { HeroId } from '../heroes';
import { SkillId, skills } from '../skills';
import { resolvePlaceAction, resolveSkillAction } from './action-resolution';
import { CpuAction, CpuDecisionCandidate, chooseCpuAction } from './cpu-action-evaluator';
import { CPU_BASELINE_LEVEL, cpuDifficulty } from './cpu-difficulty';

export type CpuOutcome='moved'|'won'|'draw'|'blocked';
export interface CpuRuntimePolicy{skillsEnabled:boolean;forcedTacticsEnabled:boolean;}
export const FULL_CPU_RUNTIME_POLICY:CpuRuntimePolicy={skillsEnabled:true,forcedTacticsEnabled:true};
export interface CpuResolution{outcome:CpuOutcome;state:CombatState;at:Pos|null;action:CpuAction|null;passiveTriggered:boolean;cpuLevel:number;decisionScore:number|null;decisionBestScore:number|null;decisionRegret:number|null;decisionReason:string|null;topCandidates:CpuDecisionCandidate[];manaBefore:number;}
export function cpuLegalCells(state:CombatState):Pos[]{const forced=forcedPlacementFor(state,2);return state.board.flatMap((row,r)=>row.map((cell,c)=>({cell,pos:{row:r,col:c}}))).filter(({cell,pos})=>cell===0&&!isSealed(state,pos)&&(!forced||samePos(forced,pos))).map(({pos})=>pos);}
export function cpuPlaceCandidates(state:CombatState):CpuAction[]{return cpuLegalCells(state).map((at)=>({kind:'place',at}));}
function cpuSourceTargetSkillCandidates(state:CombatState,skillId:'charge'):CpuAction[]{const skill=skills[skillId];if(getMana(state,2)<skill.cost||!skill.legalSources)return [];const context={state,player:2 as const};return skill.legalSources(context).flatMap((source)=>skill.legalTargets(context,source).map((target)=>({kind:'skill' as const,skillId,source,target})));}
function cpuTargetSkillCandidates(state:CombatState,skillId:SkillId):CpuAction[]{const skill=skills[skillId];if(getMana(state,2)<skill.cost)return [];const context={state,player:2 as const};return skill.legalTargets(context).map((target)=>({kind:'skill' as const,skillId,target}));}
export function cpuChargeCandidates(state:CombatState):CpuAction[]{return cpuSourceTargetSkillCandidates(state,'charge');}
export function cpuPhaseCandidates(state:CombatState):CpuAction[]{return cpuTargetSkillCandidates(state,'phase');}
export function cpuCorruptCandidates(state:CombatState):CpuAction[]{return cpuTargetSkillCandidates(state,'corrupt');}
export function cpuActionCandidates(state:CombatState,heroId:HeroId,skillsEnabled=true):CpuAction[]{return [...cpuPlaceCandidates(state),...(skillsEnabled&&heroId==='vanguard'?cpuChargeCandidates(state):[]),...(skillsEnabled&&heroId==='arcanist'?cpuPhaseCandidates(state):[]),...(skillsEnabled&&heroId==='shade'?cpuCorruptCandidates(state):[])];}

/** CPU actions use the same hero-aware resolution as the player so passives, Mana refunds and win checks stay consistent. Teaching policy can remove RPG actions without changing Free Battle defaults. */
export function resolveCpuTurn(state:CombatState,heroId:HeroId='arcanist',cpuLevel:number=CPU_BASELINE_LEVEL,policy:CpuRuntimePolicy=FULL_CPU_RUNTIME_POLICY):CpuResolution{
 const profile=cpuDifficulty(cpuLevel),manaBefore=getMana(state,2),selected=chooseCpuAction(state,cpuActionCandidates(state,heroId,policy.skillsEnabled),profile,Math.random,policy.forcedTacticsEnabled);const meta={cpuLevel:profile.level,decisionScore:selected?.score??null,decisionBestScore:selected?.bestScore??null,decisionRegret:selected?.regret??null,decisionReason:selected?.decisionReason??null,topCandidates:selected?.topCandidates??[],manaBefore};if(!selected)return {outcome:'draw',state,at:null,action:null,passiveTriggered:false,...meta};const action=selected.action;
 if(action.kind==='place'){const result=resolvePlaceAction(state,heroId,2,action.at);if(!result.ok)return {outcome:'blocked',state,at:null,action,passiveTriggered:false,...meta};return {outcome:result.won?'won':'moved',state:{...result.state,activePlayer:1},at:action.at,action,passiveTriggered:result.passiveTriggered,...meta};}
 const result=resolveSkillAction(state,heroId,2,action.skillId,action.target,action.source);if(!result.ok)return {outcome:'blocked',state,at:null,action,passiveTriggered:false,...meta};return {outcome:result.won?'won':'moved',state:{...result.state,activePlayer:1},at:action.target,action,passiveTriggered:result.passiveTriggered,...meta};
}
