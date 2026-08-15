import { Cell, Player, Pos, isWin } from './game';
import { applyManaReward, manaReward } from './patterns';

export type ActionKind = 'place' | 'skill';
export type TimedPosition = { pos: Pos; owner: Player; expiresAfterPlayer: Player };
export type CorruptedPosition = { pos: Pos; owner: Player; cpuTurnsRemaining: number };
export type CombatResource = { mana: number };
export type CombatResources = Record<Player, CombatResource>;

export type CombatState = {
  board: Cell[][];
  mana: number;
  resources: CombatResources;
  activePlayer: Player;
  guards: TimedPosition[];
  seals: TimedPosition[];
  corrupted: CorruptedPosition[];
};

export type PlaceAction = { kind: 'place'; at: Pos };
export type SkillAction = { kind: 'skill'; skillId: string; source?: Pos; target: Pos };
export type TurnAction = PlaceAction | SkillAction;
export type ActionResult = { ok:boolean; state:CombatState; consumedTurn:boolean; won:boolean; manaGained:number; error?:'occupied'|'sealed'|'corrupted'|'invalid-skill'|'insufficient-mana'|'invalid-target' };

export const samePos=(a:Pos,b:Pos)=>a.row===b.row&&a.col===b.col;
export function isSealed(state:CombatState,pos:Pos){return state.seals.some((effect)=>samePos(effect.pos,pos));}
export function isCorrupted(state:CombatState,pos:Pos){return state.corrupted.some((effect)=>samePos(effect.pos,pos));}
export function isGuarded(state:CombatState,pos:Pos){return state.guards.some((effect)=>samePos(effect.pos,pos));}
export function getMana(state:CombatState,player:Player){return state.resources[player].mana;}
export function setMana(state:CombatState,player:Player,mana:number):CombatState{const next={...state,resources:{...state.resources,[player]:{mana}}};return player===1?{...next,mana}:next;}
export function spendMana(state:CombatState,player:Player,cost:number){return setMana(state,player,Math.max(0,getMana(state,player)-cost));}

export function createCombatState(board:Cell[][],mana=0,activePlayer:Player=1):CombatState{return{board,mana,resources:{1:{mana},2:{mana:0}},activePlayer,guards:[],seals:[],corrupted:[]};}

export function executePlace(state: CombatState, action: PlaceAction): ActionResult {
  const {row,col}=action.at;
  if(state.board[row]?.[col]!==0)return{ok:false,state,consumedTurn:false,won:false,manaGained:0,error:'occupied'};
  if(isSealed(state,action.at))return{ok:false,state,consumedTurn:false,won:false,manaGained:0,error:'sealed'};
  if(isCorrupted(state,action.at))return{ok:false,state,consumedTurn:false,won:false,manaGained:0,error:'corrupted'};
  const board=state.board.map((line)=>[...line]);board[row][col]=state.activePlayer;
  const won=isWin(board,action.at,state.activePlayer);const reward=won?0:manaReward(board,action.at,state.activePlayer);
  const next=setMana({...state,board},state.activePlayer,applyManaReward(getMana(state,state.activePlayer),reward));
  return{ok:true,state:next,consumedTurn:true,won,manaGained:reward};
}

export function expireEffectsAfterTurn(state:CombatState,player:Player):CombatState{
  const corrupted=player===2?state.corrupted.map((e)=>({...e,cpuTurnsRemaining:e.cpuTurnsRemaining-1})).filter((e)=>e.cpuTurnsRemaining>0):state.corrupted;
  return{...state,guards:state.guards.filter((e)=>e.expiresAfterPlayer!==player),seals:state.seals.filter((e)=>e.expiresAfterPlayer!==player),corrupted};
}
export function addGuard(state:CombatState,pos:Pos,owner:Player):CombatState{return{...state,guards:[...state.guards.filter((e)=>!samePos(e.pos,pos)),{pos,owner,expiresAfterPlayer:owner===1?2:1}]};}
export function addSeal(state:CombatState,pos:Pos,owner:Player):CombatState{return{...state,seals:[...state.seals.filter((e)=>!samePos(e.pos,pos)),{pos,owner,expiresAfterPlayer:owner===1?2:1}]};}
/** Corruption blocks both actors through the next player turn and expires after the following CPU turn. */
export function addCorruption(state:CombatState,pos:Pos,owner:Player):CombatState{return{...state,corrupted:[...state.corrupted.filter((e)=>!samePos(e.pos,pos)),{pos,owner,cpuTurnsRemaining:2}]};}
