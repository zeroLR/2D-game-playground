import { BOARD_SIZE, Cell } from './game';
import { ActionHistoryEntry } from './runtime/action-feedback';

export type ReplayEffectKind='place'|'move'|'remove'|'push'|'status';
export interface ReplayEffect { kind:ReplayEffectKind; at:{row:number;col:number}; source?:{row:number;col:number}; player?:1|2; skillId?:string; }
export interface ReplayFrame { index:number; sequence:number; beforeBoard:Cell[][]; board:Cell[][]; action:ActionHistoryEntry|null; effects:ReplayEffect[]; }

const emptyBoard=():Cell[][]=>Array.from({length:BOARD_SIZE},()=>Array<Cell>(BOARD_SIZE).fill(0));
const copyBoard=(board:Cell[][]):Cell[][]=>board.map(row=>[...row]);

function projectAction(board:Cell[][],action:ActionHistoryEntry):ReplayEffect[]{
 const effects:ReplayEffect[]=[];
 if(action.kind==='place'){
  board[action.at.row][action.at.col]=action.player;effects.push({kind:'place',at:action.at,player:action.player});
 }else if(action.skillId==='blink'&&action.source){
  board[action.source.row][action.source.col]=0;board[action.at.row][action.at.col]=action.player;effects.push({kind:'move',source:action.source,at:action.at,player:action.player,skillId:action.skillId});
 }else if(action.skillId==='corrupt'){
  board[action.at.row][action.at.col]=0;effects.push({kind:'remove',at:action.at,player:action.player,skillId:action.skillId});
 }else if(action.skillId==='charge'&&action.source){
  const dr=action.at.row-action.source.row,dc=action.at.col-action.source.col,target=board[action.at.row]?.[action.at.col];
  if(target&&target!==action.player){const pushed={row:action.at.row+dr,col:action.at.col+dc};if(board[pushed.row]?.[pushed.col]===0){board[pushed.row][pushed.col]=target;effects.push({kind:'push',source:action.at,at:pushed,player:target,skillId:action.skillId});}}
  board[action.source.row][action.source.col]=0;board[action.at.row][action.at.col]=action.player;effects.push({kind:'move',source:action.source,at:action.at,player:action.player,skillId:action.skillId});
 }else if(action.skillId==='phase'){
  board[action.at.row][action.at.col]=action.player;effects.push({kind:'place',at:action.at,player:action.player,skillId:action.skillId});
 }else if(action.kind==='skill'){
  effects.push({kind:'status',at:action.at,source:action.source,player:action.player,skillId:action.skillId});
 }
 return effects;
}

/** Deterministic presentation projection. Each frame keeps both sides of the action boundary so UI can animate persisted skill impact without re-running current combat rules. */
export function projectReplay(actions:readonly ActionHistoryEntry[]):ReplayFrame[]{
 const board=emptyBoard(),initial=copyBoard(board);const frames:ReplayFrame[]=[{index:0,sequence:0,beforeBoard:initial,board:initial,action:null,effects:[]}];
 for(const action of actions){const beforeBoard=copyBoard(board),effects=projectAction(board,action);frames.push({index:frames.length,sequence:action.sequence,beforeBoard,board:copyBoard(board),action,effects});}
 return frames;
}
export function clampReplayIndex(index:number,frameCount:number){return Math.max(0,Math.min(index,Math.max(0,frameCount-1)));}
