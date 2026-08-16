import { BOARD_SIZE, Player, Pos, longestLine } from '../game';
import { CombatState } from '../combat';
import type { SkillId } from '../skills';

export type CpuPlaceAction={kind:'place';at:Pos};
export type CpuSkillAction={kind:'skill';skillId:SkillId;target:Pos;source?:Pos};
export type CpuAction=CpuPlaceAction|CpuSkillAction;
export interface ScoredCpuAction{action:CpuAction;score:number;}

const CPU:Player=2,PLAYER:Player=1;
const dirs=[[1,0],[0,1],[1,1],[1,-1]] as const;
function inBoard(row:number,col:number){return row>=0&&row<BOARD_SIZE&&col>=0&&col<BOARD_SIZE;}
function centerScore(p:Pos){const center=(BOARD_SIZE-1)/2;return 40-(Math.abs(p.row-center)+Math.abs(p.col-center))*4;}
function linePotential(state:CombatState,p:Pos,player:Player){
 const board=state.board;if(board[p.row]?.[p.col]!==0)return -Infinity;
 board[p.row][p.col]=player;const length=longestLine(board,p,player);let open=0;
 for(const [dr,dc] of dirs){for(const sign of [-1,1]){const r=p.row+dr*sign,c=p.col+dc*sign;if(inBoard(r,c)&&board[r][c]===0)open++;}}
 board[p.row][p.col]=0;
 if(length>=5)return 100000;if(length===4)return 18000+open*100;if(length===3)return 3200+open*40;if(length===2)return 280+open*10;return 12;
}

/** Shared CPU action scorer. Slice 1 only feeds placement candidates into this evaluator; later slices add hero skill candidates without replacing the decision boundary. */
export function scoreCpuAction(state:CombatState,action:CpuAction):number{
 if(action.kind==='place'){
  const attack=linePotential(state,action.at,CPU),defense=linePotential(state,action.at,PLAYER);
  if(attack>=100000)return 1_000_000;if(defense>=100000)return 900_000;
  return attack*1.05+defense*1.15+centerScore(action.at);
 }
 return 0;
}

export function chooseCpuAction(state:CombatState,candidates:readonly CpuAction[]):ScoredCpuAction|null{
 let best:ScoredCpuAction|null=null;
 for(const action of candidates){const scored={action,score:scoreCpuAction(state,action)};if(!best||scored.score>best.score)best=scored;}
 return best;
}
