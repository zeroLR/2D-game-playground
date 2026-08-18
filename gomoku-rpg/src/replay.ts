import { BOARD_SIZE, Cell } from './game';
import { ActionHistoryEntry } from './runtime/action-feedback';

export interface ReplayFrame { index:number; sequence:number; board:Cell[][]; action:ActionHistoryEntry|null; }

const emptyBoard=():Cell[][]=>Array.from({length:BOARD_SIZE},()=>Array<Cell>(BOARD_SIZE).fill(0));
const copyBoard=(board:Cell[][]):Cell[][]=>board.map(row=>[...row]);

/**
 * Deterministically projects the board from persisted action history.
 * ActionHistoryEntry is presentation history rather than a full CombatState event log,
 * so this reconstructs visible stones only. Status effects are intentionally excluded.
 */
export function projectReplay(actions:readonly ActionHistoryEntry[]):ReplayFrame[]{
 const board=emptyBoard();
 const frames:ReplayFrame[]=[{index:0,sequence:0,board:copyBoard(board),action:null}];
 for(const action of actions){
  if(action.kind==='place')board[action.at.row][action.at.col]=action.player;
  else if(action.skillId==='blink'&&action.source){board[action.source.row][action.source.col]=0;board[action.at.row][action.at.col]=action.player;}
  else if(action.skillId==='corrupt')board[action.at.row][action.at.col]=0;
  else if(action.skillId==='charge'&&action.source){
   const dr=action.at.row-action.source.row,dc=action.at.col-action.source.col;
   const target=board[action.at.row]?.[action.at.col];
   if(target&&target!==action.player){const pushedRow=action.at.row+dr,pushedCol=action.at.col+dc;if(board[pushedRow]?.[pushedCol]===0)board[pushedRow][pushedCol]=target;}
   board[action.source.row][action.source.col]=0;board[action.at.row][action.at.col]=action.player;
  }
  else if(action.skillId==='phase')board[action.at.row][action.at.col]=action.player;
  // guard / seal / bulwark do not change stone occupancy.
  frames.push({index:frames.length,sequence:action.sequence,board:copyBoard(board),action});
 }
 return frames;
}

export function clampReplayIndex(index:number,frameCount:number){return Math.max(0,Math.min(index,Math.max(0,frameCount-1)));}
