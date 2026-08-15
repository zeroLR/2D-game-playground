import { Cell, Player, Pos, isWin } from './game';
import { applyManaReward, manaReward } from './patterns';
export type ActionKind='place'|'skill';
export type TimedPosition={pos:Pos;owner:Player;expiresAfterPlayer:Player};
export type CorruptedPosition={pos:Pos;owner:Player;turnsRemaining:number};
export type CombatResource={mana:number};export type CombatResources=Record<Player,CombatResource>;
export type CombatState={board:Cell[][];mana:number;resources:CombatResources;activePlayer:Player;guards:TimedPosition[];seals:TimedPosition[];corrupted:CorruptedPosition[]};
export type PlaceAction={kind:'place';at:Pos};export type SkillAction={kind:'skill';skillId:string;source?:Pos;target:Pos};export type TurnAction=PlaceAction|SkillAction;
export type ActionResult={ok:boolean;state:CombatState;consumedTurn:boolean;won:boolean;manaGained:number;error?:'occupied'|'sealed'|'corrupted'|'invalid-skill'|'insufficient-mana'|'invalid-target'};
export const samePos=(a:Pos,b:Pos)=>a.row===b.row&&a.col===b.col;
export function isCorrupted(state:CombatState,pos:Pos){return state.corrupted.some((e)=>samePos(e.pos,pos));}
/** Corrupted intersections participate in the same board-legality boundary as Seal so CPU and player targeting both avoid them. */
export function isSealed(state:CombatState,pos:Pos){return state.seals.some((e)=>samePos(e.pos,pos))||isCorrupted(state,pos);}
export function isGuarded(state:CombatState,pos:Pos){return state.guards.some((e)=>samePos(e.pos,pos));}
export function getMana(state:CombatState,player:Player){return state.resources[player].mana;}
export function setMana(state:CombatState,player:Player,mana:number):CombatState{const next={...state,resources:{...state.resources,[player]:{mana}}};return player===1?{...next,mana}:next;}
export function spendMana(state:CombatState,player:Player,cost:number){return setMana(state,player,Math.max(0,getMana(state,player)-cost));}
export function createCombatState(board:Cell[][],mana=0,activePlayer:Player=1):CombatState{return{board,mana,resources:{1:{mana},2:{mana:0}},activePlayer,guards:[],seals:[],corrupted:[]};}
export function executePlace(state:CombatState,action:PlaceAction):ActionResult{const{row,col}=action.at;if(state.board[row]?.[col]!==0)return{ok:false,state,consumedTurn:false,won:false,manaGained:0,error:'occupied'};if(isCorrupted(state,action.at))return{ok:false,state,consumedTurn:false,won:false,manaGained:0,error:'corrupted'};if(isSealed(state,action.at))return{ok:false,state,consumedTurn:false,won:false,manaGained:0,error:'sealed'};const board=state.board.map((line)=>[...line]);board[row][col]=state.activePlayer;const won=isWin(board,action.at,state.activePlayer);const reward=won?0:manaReward(board,action.at,state.activePlayer);const next=setMana({...state,board},state.activePlayer,applyManaReward(getMana(state,state.activePlayer),reward));return{ok:true,state:next,consumedTurn:true,won,manaGained:reward};}
/** Corrupt is created before the caster's turn closes. Three end-of-turn ticks therefore cover: cast turn -> CPU response -> player's next turn, and the zone is gone when the following CPU turn starts. */
export function expireEffectsAfterTurn(state:CombatState,player:Player):CombatState{const corrupted=state.corrupted.map((e)=>({...e,turnsRemaining:e.turnsRemaining-1})).filter((e)=>e.turnsRemaining>0);return{...state,guards:state.guards.filter((e)=>e.expiresAfterPlayer!==player),seals:state.seals.filter((e)=>e.expiresAfterPlayer!==player),corrupted};}
export function addGuard(state:CombatState,pos:Pos,owner:Player):CombatState{return{...state,guards:[...state.guards.filter((e)=>!samePos(e.pos,pos)),{pos,owner,expiresAfterPlayer:owner===1?2:1}]};}
export function addSeal(state:CombatState,pos:Pos,owner:Player):CombatState{return{...state,seals:[...state.seals.filter((e)=>!samePos(e.pos,pos)),{pos,owner,expiresAfterPlayer:owner===1?2:1}]};}
export function addCorruption(state:CombatState,pos:Pos,owner:Player):CombatState{return{...state,corrupted:[...state.corrupted.filter((e)=>!samePos(e.pos,pos)),{pos,owner,turnsRemaining:3}]};}
