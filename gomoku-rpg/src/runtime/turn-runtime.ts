import { advanceAbilityEconomyAfterTurn } from '../ability-economy';
import { Player } from '../game';
import { CombatState, expireEffectsAfterTurn } from '../combat';

export type MatchStatus='playing'|'victory'|'defeat'|'draw';
/** Who the match is waiting on. `over` means the match is decided and accepts no more actions. */
export type TurnPhase='player'|'cpu'|'over';
export interface TurnState{turn:number;phase:TurnPhase;status:MatchStatus}
export interface TurnTransition{state:CombatState;turn:TurnState}

export const createTurnState=():TurnState=>({turn:1,phase:'player',status:'playing'});
export const isPlayerInput=(turn:TurnState)=>turn.phase==='player'&&turn.status==='playing';
export const isMatchOver=(turn:TurnState)=>turn.status!=='playing';

/** Closes one actor's turn: expire timed board effects and advance that actor's ability economy. */
export function advanceTurn(state:CombatState,actor:Player):CombatState{
  return advanceAbilityEconomyAfterTurn(expireEffectsAfterTurn(state,actor),actor);
}

/** A turn-consuming player action: expire, count the turn, hand the board to the CPU. */
export function completePlayerTurn(state:CombatState,turn:TurnState):TurnTransition{
  return {state:advanceTurn(state,1),turn:{...turn,turn:turn.turn+1,phase:'cpu'}};
}

/** A free action: nothing expires, the turn counter holds, the player acts again. */
export function continuePlayerTurn(turn:TurnState):TurnState{return {...turn,phase:'player'};}

export function completeCpuTurn(state:CombatState,turn:TurnState):TurnTransition{
  return {state:advanceTurn(state,2),turn:{...turn,phase:'player'}};
}

export function endMatch(turn:TurnState,status:Exclude<MatchStatus,'playing'>):TurnState{
  return {...turn,status,phase:'over'};
}
