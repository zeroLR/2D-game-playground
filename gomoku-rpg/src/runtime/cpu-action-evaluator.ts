import { BOARD_SIZE, Player, Pos, isWin, longestLine } from '../game';
import { CombatState } from '../combat';
import { SkillId, skills } from '../skills';

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
function boardThreat(state:CombatState,player:Player){let best=0;state.board.forEach((row,r)=>row.forEach((cell,c)=>{if(cell===0)best=Math.max(best,linePotential(state,{row:r,col:c},player));}));return best;}
function chargeScore(state:CombatState,action:CpuSkillAction){
 if(action.skillId!=='charge'||!action.source)return 0;
 const beforePlayer=boardThreat(state,PLAYER),beforeCpu=boardThreat(state,CPU);
 const next=skills.charge.execute({state,player:CPU},action.target,action.source);
 if(isWin(next.board,action.target,CPU))return 1_000_000;
 const afterPlayer=boardThreat(next,PLAYER),afterCpu=boardThreat(next,CPU);
 const disrupted=Math.max(0,beforePlayer-afterPlayer),improved=Math.max(0,afterCpu-beforeCpu);
 const pushedEnemy=state.board[action.target.row]?.[action.target.col]===PLAYER;
 // Charge should be chosen for material board restructuring, not merely because Mana is available.
 return disrupted*1.25+improved*1.05+(pushedEnemy?240:0)-180;
}

export function scoreCpuAction(state:CombatState,action:CpuAction):number{
 if(action.kind==='place'){
  const attack=linePotential(state,action.at,CPU),defense=linePotential(state,action.at,PLAYER);
  if(attack>=100000)return 1_000_000;if(defense>=100000)return 900_000;
  return attack*1.05+defense*1.15+centerScore(action.at);
 }
 return chargeScore(state,action);
}

export function chooseCpuAction(state:CombatState,candidates:readonly CpuAction[]):ScoredCpuAction|null{
 let best:ScoredCpuAction|null=null;
 for(const action of candidates){const scored={action,score:scoreCpuAction(state,action)};if(!best||scored.score>best.score)best=scored;}
 return best;
}
