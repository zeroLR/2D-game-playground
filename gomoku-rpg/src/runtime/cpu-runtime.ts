import { Pos, chooseCpuMove } from '../game';
import { CombatState, executePlace, isSealed } from '../combat';

/** `blocked` means the chosen move turned out to be unplayable; the player simply acts again. */
export type CpuOutcome='moved'|'won'|'draw'|'blocked';
export interface CpuResolution{outcome:CpuOutcome;state:CombatState;at:Pos|null}

/** Empty intersections the CPU may play: Seal and Corrupt share one board-legality boundary. */
export function cpuLegalCells(state:CombatState):Pos[]{
  return state.board.flatMap((row,r)=>row.map((cell,c)=>({cell,pos:{row:r,col:c}}))).filter(({cell,pos})=>cell===0&&!isSealed(state,pos)).map(({pos})=>pos);
}

/** Pure CPU turn: pick a move and place it. Timed effects are expired by the caller. */
export function resolveCpuTurn(state:CombatState):CpuResolution{
  const at=chooseCpuMove(state.board,cpuLegalCells(state));
  if(!at)return {outcome:'draw',state,at:null};
  const result=executePlace({...state,activePlayer:2},{kind:'place',at});
  if(!result.ok)return {outcome:'blocked',state,at:null};
  return {outcome:result.won?'won':'moved',state:{...result.state,activePlayer:1},at};
}
