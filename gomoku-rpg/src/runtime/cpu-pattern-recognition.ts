import { BOARD_SIZE, Player, Pos } from '../game';
import { CombatState } from '../combat';

const dirs=[[1,0],[0,1],[1,1],[1,-1]] as const;
function inside(r:number,c:number){return r>=0&&r<BOARD_SIZE&&c>=0&&c<BOARD_SIZE;}

export type CpuPatternKind='five'|'open-four'|'four'|'open-three'|'three'|'open-two'|'two'|'none';
export interface CpuPattern { kind:CpuPatternKind; length:number; openEnds:number; score:number; }

function classify(length:number,openEnds:number):CpuPatternKind{
 if(length>=5)return 'five';
 if(length===4&&openEnds===2)return 'open-four';
 if(length===4&&openEnds>0)return 'four';
 if(length===3&&openEnds===2)return 'open-three';
 if(length===3&&openEnds>0)return 'three';
 if(length===2&&openEnds===2)return 'open-two';
 if(length===2&&openEnds>0)return 'two';
 return 'none';
}
function value(kind:CpuPatternKind){return {five:100000,'open-four':42000,four:18000,'open-three':7200,three:2800,'open-two':720,two:260,none:12}[kind];}

export function recognizeMovePatterns(state:CombatState,p:Pos,player:Player,depth=3):CpuPattern[]{
 if(state.board[p.row]?.[p.col]!==0)return [];
 const patterns:CpuPattern[]=[];
 for(const [dr,dc] of dirs){
  let length=1,openEnds=0;
  for(const sign of [-1,1]){
   let r=p.row+dr*sign,c=p.col+dc*sign,steps=0;
   while(inside(r,c)&&state.board[r][c]===player&&steps<Math.max(1,depth)){length++;steps++;r+=dr*sign;c+=dc*sign;}
   if(inside(r,c)&&state.board[r][c]===0)openEnds++;
  }
  const kind=classify(length,openEnds);patterns.push({kind,length,openEnds,score:value(kind)});
 }
 return patterns.sort((a,b)=>b.score-a.score);
}

export function patternMoveScore(state:CombatState,p:Pos,player:Player,depth=3){
 const patterns=recognizeMovePatterns(state,p,player,depth);if(!patterns.length)return -Infinity;
 const primary=patterns[0].score;
 // Forks matter: two simultaneous open/forcing lines are much stronger than one isolated line.
 const forcing=patterns.filter(x=>x.kind==='open-four'||x.kind==='four'||x.kind==='open-three');
 const forkBonus=forcing.length>=2?Math.min(24000,forcing.slice(1).reduce((s,x)=>s+x.score*.65,0)):0;
 return primary+forkBonus+patterns.slice(1).reduce((s,x)=>s+x.score*.08,0);
}
