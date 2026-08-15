import { Cell, Player, Pos, isWin } from './game';
import { applyManaReward, manaReward } from './patterns';

export type ActionKind = 'place' | 'skill';
export type TimedPosition = { pos: Pos; owner: Player; expiresAfterPlayer: Player };

export type CombatState = {
  board: Cell[][];
  mana: number;
  activePlayer: Player;
  guards: TimedPosition[];
  seals: TimedPosition[];
};

export type PlaceAction = { kind: 'place'; at: Pos };
export type SkillAction = { kind: 'skill'; skillId: string; source?: Pos; target: Pos };
export type TurnAction = PlaceAction | SkillAction;
export type ActionResult = { ok:boolean; state:CombatState; consumedTurn:boolean; won:boolean; manaGained:number; error?:'occupied'|'sealed'|'invalid-skill'|'insufficient-mana'|'invalid-target' };

export const samePos=(a:Pos,b:Pos)=>a.row===b.row&&a.col===b.col;
export function isSealed(state:CombatState,pos:Pos){return state.seals.some((effect)=>samePos(effect.pos,pos));}
export function isGuarded(state:CombatState,pos:Pos){return state.guards.some((effect)=>samePos(effect.pos,pos));}

export function createCombatState(board:Cell[][],mana=0,activePlayer:Player=1):CombatState{return{board,mana,activePlayer,guards:[],seals:[]};}

export function executePlace(state: CombatState, action: PlaceAction): ActionResult {
  const {row,col}=action.at;
  if(state.board[row]?.[col]!==0)return{ok:false,state,consumedTurn:false,won:false,manaGained:0,error:'occupied'};
  if(isSealed(state,action.at))return{ok:false,state,consumedTurn:false,won:false,manaGained:0,error:'sealed'};
  const board=state.board.map((line)=>[...line]);board[row][col]=state.activePlayer;
  const won=isWin(board,action.at,state.activePlayer);const reward=won?0:manaReward(board,action.at,state.activePlayer);
  return{ok:true,state:{...state,board,mana:applyManaReward(state.mana,reward)},consumedTurn:true,won,manaGained:reward};
}

/** Called after a player completes a turn. Effects whose expiry player just acted are removed. */
export function expireEffectsAfterTurn(state:CombatState,player:Player):CombatState{
  return{...state,guards:state.guards.filter((e)=>e.expiresAfterPlayer!==player),seals:state.seals.filter((e)=>e.expiresAfterPlayer!==player)};
}

export function addGuard(state:CombatState,pos:Pos,owner:Player):CombatState{
  return{...state,guards:[...state.guards.filter((e)=>!samePos(e.pos,pos)),{pos,owner,expiresAfterPlayer:owner===1?2:1}]};
}

export function addSeal(state:CombatState,pos:Pos,owner:Player):CombatState{
  return{...state,seals:[...state.seals.filter((e)=>!samePos(e.pos,pos)),{pos,owner,expiresAfterPlayer:owner===1?2:1}]};
}
