import { Player, Pos, isWin } from '../game';
import { CombatState, isSealed } from '../combat';
import { CpuDifficultyProfile } from './cpu-difficulty';
import { patternMoveScore } from './cpu-pattern-recognition';

const CPU:Player=2,PLAYER:Player=1;
export interface SearchedCandidate { at:Pos; immediate:number; response:number; score:number; }
function copyState(state:CombatState):CombatState{return {...state,board:state.board.map(row=>[...row])};}
function play(state:CombatState,p:Pos,player:Player){const next=copyState(state);next.board[p.row][p.col]=player;return next;}
function legal(state:CombatState):Pos[]{return state.board.flatMap((row,r)=>row.map((cell,c)=>({cell,p:{row:r,col:c}}))).filter(({cell,p})=>cell===0&&!isSealed(state,p)).map(x=>x.p);}
function localCandidate(state:CombatState,p:Pos){for(let r=Math.max(0,p.row-2);r<=Math.min(state.board.length-1,p.row+2);r++)for(let c=Math.max(0,p.col-2);c<=Math.min(state.board[r].length-1,p.col+2);c++)if(state.board[r][c]!==0)return true;return false;}
function staticValue(state:CombatState,p:Pos,profile:CpuDifficultyProfile){const attack=patternMoveScore(state,p,CPU,profile.patternDepth),defense=patternMoveScore(state,p,PLAYER,profile.patternDepth);return attack*(.7+.35*profile.threatAwareness)+defense*(.6+.55*profile.defenseAwareness);}
export function searchCpuPlaceCandidates(state:CombatState,profile:CpuDifficultyProfile):SearchedCandidate[]{
 const all=legal(state);if(!all.length)return [];
 const nearby=all.filter(p=>localCandidate(state,p)),pool=(nearby.length?nearby:all).map(at=>({at,immediate:staticValue(state,at,profile)})).sort((a,b)=>b.immediate-a.immediate).slice(0,Math.max(1,profile.candidateWidth));
 if(profile.searchDepth<=0)return pool.map(x=>({...x,response:0,score:x.immediate}));
 return pool.map(candidate=>{
  const afterCpu=play(state,candidate.at,CPU);if(isWin(afterCpu.board,candidate.at,CPU))return {...candidate,response:0,score:1_000_000};
  const replies=legal(afterCpu).map(at=>({at,value:staticValue(afterCpu,at,{...profile,threatAwareness:profile.defenseAwareness,defenseAwareness:profile.threatAwareness})})).sort((a,b)=>b.value-a.value).slice(0,Math.max(2,profile.candidateWidth));
  let worst=0;for(const reply of replies){const afterPlayer=play(afterCpu,reply.at,PLAYER);if(isWin(afterPlayer.board,reply.at,PLAYER)){worst=900_000;break;}const playerThreat=patternMoveScore(afterCpu,reply.at,PLAYER,profile.patternDepth);const cpuFollow=legal(afterPlayer).map(p=>patternMoveScore(afterPlayer,p,CPU,profile.patternDepth)).sort((a,b)=>b-a)[0]??0;worst=Math.max(worst,playerThreat-Math.min(cpuFollow,playerThreat)*.35);}
  return {...candidate,response:worst,score:candidate.immediate-worst*(.65+.25*profile.defenseAwareness)};
 }).sort((a,b)=>b.score-a.score);
}

export function candidateSearchBonus(state:CombatState,p:Pos,profile:CpuDifficultyProfile){if(profile.level<5||profile.searchDepth<=0)return 0;const searched=searchCpuPlaceCandidates(state,profile),found=searched.find(x=>x.at.row===p.row&&x.at.col===p.col);if(!found)return -50_000;return found.score-found.immediate;}
