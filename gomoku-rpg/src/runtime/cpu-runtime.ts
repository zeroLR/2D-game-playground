import { Pos } from '../game';
import { CombatState, getMana, isSealed } from '../combat';
import { HeroId } from '../heroes';
import { skills } from '../skills';
import { resolvePlaceAction, resolveSkillAction } from './action-resolution';
import { CpuAction, chooseCpuAction } from './cpu-action-evaluator';

export type CpuOutcome='moved'|'won'|'draw'|'blocked';
export interface CpuResolution{outcome:CpuOutcome;state:CombatState;at:Pos|null;action:CpuAction|null;passiveTriggered:boolean}
export function cpuLegalCells(state:CombatState):Pos[]{return state.board.flatMap((row,r)=>row.map((cell,c)=>({cell,pos:{row:r,col:c}}))).filter(({cell,pos})=>cell===0&&!isSealed(state,pos)).map(({pos})=>pos);}
export function cpuPlaceCandidates(state:CombatState):CpuAction[]{return cpuLegalCells(state).map((at)=>({kind:'place',at}));}
function cpuSourceTargetSkillCandidates(state:CombatState,skillId:'charge'|'phase'):CpuAction[]{const skill=skills[skillId];if(getMana(state,2)<skill.cost||!skill.legalSources)return [];const context={state,player:2 as const};return skill.legalSources(context).flatMap((source)=>skill.legalTargets(context,source).map((target)=>({kind:'skill' as const,skillId,source,target})));}
export function cpuChargeCandidates(state:CombatState):CpuAction[]{return cpuSourceTargetSkillCandidates(state,'charge');}
export function cpuPhaseCandidates(state:CombatState):CpuAction[]{return cpuSourceTargetSkillCandidates(state,'phase');}
export function cpuActionCandidates(state:CombatState,heroId:HeroId):CpuAction[]{return [...cpuPlaceCandidates(state),...(heroId==='vanguard'?cpuChargeCandidates(state):[]),...(heroId==='arcanist'?cpuPhaseCandidates(state):[])];}

/** CPU actions use the same hero-aware resolution as the player so passives, Mana refunds and win checks stay consistent. */
export function resolveCpuTurn(state:CombatState,heroId:HeroId='arcanist'):CpuResolution{
 const selected=chooseCpuAction(state,cpuActionCandidates(state,heroId));if(!selected)return {outcome:'draw',state,at:null,action:null,passiveTriggered:false};const action=selected.action;
 if(action.kind==='place'){const result=resolvePlaceAction(state,heroId,2,action.at);if(!result.ok)return {outcome:'blocked',state,at:null,action,passiveTriggered:false};return {outcome:result.won?'won':'moved',state:{...result.state,activePlayer:1},at:action.at,action,passiveTriggered:result.passiveTriggered};}
 const result=resolveSkillAction(state,heroId,2,action.skillId,action.target,action.source);if(!result.ok)return {outcome:'blocked',state,at:null,action,passiveTriggered:false};return {outcome:result.won?'won':'moved',state:{...result.state,activePlayer:1},at:action.target,action,passiveTriggered:result.passiveTriggered};
}
