import { Pos } from '../game';
import { CombatState, executePlace, isSealed } from '../combat';
import { CpuAction, chooseCpuAction } from './cpu-action-evaluator';

/** `blocked` means the chosen move turned out to be unplayable; the player simply acts again. */
export type CpuOutcome='moved'|'won'|'draw'|'blocked';
export interface CpuResolution{outcome:CpuOutcome;state:CombatState;at:Pos|null}

/** Empty intersections the CPU may play: Seal and Corrupt share one board-legality boundary. */
export function cpuLegalCells(state:CombatState):Pos[]{
  return state.board.flatMap((row,r)=>row.map((cell,c)=>({cell,pos:{row:r,col:c}}))).filter(({cell,pos})=>cell===0&&!isSealed(state,pos)).map(({pos})=>pos);
}

export function cpuPlaceCandidates(state:CombatState):CpuAction[]{return cpuLegalCells(state).map((at)=>({kind:'place',at}));}

/** Pure CPU turn. All action types now cross the same evaluator boundary; Slice 1 only generates placement candidates. */
export function resolveCpuTurn(state:CombatState):CpuResolution{
  const selected=chooseCpuAction(state,cpuPlaceCandidates(state));
  if(!selected)return {outcome:'draw',state,at:null};
  const action=selected.action;
  if(action.kind!=='place')return {outcome:'blocked',state,at:null};
  const result=executePlace({...state,activePlayer:2},{kind:'place',at:action.at});
  if(!result.ok)return {outcome:'blocked',state,at:null};
  return {outcome:result.won?'won':'moved',state:{...result.state,activePlayer:1},at:action.at};
}
