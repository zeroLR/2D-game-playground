import { Pos, isWin } from '../game';
import { CombatState, executePlace, getMana, isSealed } from '../combat';
import { HeroId } from '../heroes';
import { skills } from '../skills';
import { CpuAction, chooseCpuAction } from './cpu-action-evaluator';

export type CpuOutcome='moved'|'won'|'draw'|'blocked';
export interface CpuResolution{outcome:CpuOutcome;state:CombatState;at:Pos|null;action:CpuAction|null}

export function cpuLegalCells(state:CombatState):Pos[]{
  return state.board.flatMap((row,r)=>row.map((cell,c)=>({cell,pos:{row:r,col:c}}))).filter(({cell,pos})=>cell===0&&!isSealed(state,pos)).map(({pos})=>pos);
}
export function cpuPlaceCandidates(state:CombatState):CpuAction[]{return cpuLegalCells(state).map((at)=>({kind:'place',at}));}
export function cpuChargeCandidates(state:CombatState):CpuAction[]{
 const skill=skills.charge;if(getMana(state,2)<skill.cost||!skill.legalSources)return [];
 const context={state,player:2 as const};
 return skill.legalSources(context).flatMap((source)=>skill.legalTargets(context,source).map((target)=>({kind:'skill' as const,skillId:'charge' as const,source,target})));
}
export function cpuActionCandidates(state:CombatState,heroId:HeroId):CpuAction[]{return [...cpuPlaceCandidates(state),...(heroId==='vanguard'?cpuChargeCandidates(state):[])];}

/** CPU hero identity controls which skill candidates enter the shared evaluator. */
export function resolveCpuTurn(state:CombatState,heroId:HeroId='arcanist'):CpuResolution{
  const selected=chooseCpuAction(state,cpuActionCandidates(state,heroId));
  if(!selected)return {outcome:'draw',state,at:null,action:null};
  const action=selected.action;
  if(action.kind==='place'){
   const result=executePlace({...state,activePlayer:2},{kind:'place',at:action.at});
   if(!result.ok)return {outcome:'blocked',state,at:null,action};
   return {outcome:result.won?'won':'moved',state:{...result.state,activePlayer:1},at:action.at,action};
  }
  if(action.skillId!=='charge'||!action.source)return {outcome:'blocked',state,at:null,action};
  const next=skills.charge.execute({state:{...state,activePlayer:2},player:2},action.target,action.source);
  const won=isWin(next.board,action.target,2);
  return {outcome:won?'won':'moved',state:{...next,activePlayer:1},at:action.target,action};
}
