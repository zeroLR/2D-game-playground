export const BOARD_SIZE = 9;
export const WIN_LENGTH = 5;
export type Cell = 0 | 1 | 2;
export type Player = 1 | 2;
export type Pos = { row: number; col: number };

export function createBoard(): Cell[][] { return Array.from({ length: BOARD_SIZE }, () => Array<Cell>(BOARD_SIZE).fill(0)); }
const dirs = [[1,0],[0,1],[1,1],[1,-1]] as const;
function inBoard(row:number,col:number){return row>=0&&row<BOARD_SIZE&&col>=0&&col<BOARD_SIZE;}
function count(board:Cell[][],p:Pos,player:Player,dr:number,dc:number){let n=0;for(let r=p.row+dr,c=p.col+dc;inBoard(r,c)&&board[r][c]===player;r+=dr,c+=dc)n++;return n;}
export function longestLine(board:Cell[][],p:Pos,player:Player){return Math.max(...dirs.map(([dr,dc])=>1+count(board,p,player,dr,dc)+count(board,p,player,-dr,-dc)));}
export function isWin(board:Cell[][],p:Pos,player:Player){return longestLine(board,p,player)>=WIN_LENGTH;}

/** Returns the full contiguous winning line through the last move, or an empty array. */
export function winningLine(board:Cell[][],p:Pos,player:Player):Pos[]{
 for(const [dr,dc] of dirs){
  let row=p.row,col=p.col;
  while(inBoard(row-dr,col-dc)&&board[row-dr][col-dc]===player){row-=dr;col-=dc;}
  const line:Pos[]=[];
  while(inBoard(row,col)&&board[row][col]===player){line.push({row,col});row+=dr;col+=dc;}
  if(line.length>=WIN_LENGTH)return line;
 }
 return [];
}

export function emptyCells(board:Cell[][]):Pos[]{const out:Pos[]=[];board.forEach((row,r)=>row.forEach((v,c)=>{if(!v)out.push({row:r,col:c});}));return out;}

type LineShape={length:number;openEnds:number};
function shapeAt(board:Cell[][],p:Pos,player:Player,dr:number,dc:number):LineShape{
 const forward=count(board,p,player,dr,dc),backward=count(board,p,player,-dr,-dc),length=1+forward+backward;
 const fr=p.row+(forward+1)*dr,fc=p.col+(forward+1)*dc,br=p.row-(backward+1)*dr,bc=p.col-(backward+1)*dc;
 const openEnds=Number(inBoard(fr,fc)&&board[fr][fc]===0)+Number(inBoard(br,bc)&&board[br][bc]===0);
 return {length,openEnds};
}
function shapeScore({length,openEnds}:LineShape){
 if(length>=5)return 100000;
 if(length===4&&openEnds===2)return 18000;
 if(length===4&&openEnds===1)return 7000;
 if(length===3&&openEnds===2)return 3200;
 if(length===3&&openEnds===1)return 900;
 if(length===2&&openEnds===2)return 280;
 if(length===2&&openEnds===1)return 90;
 return 12;
}
function tacticalScore(board:Cell[][],p:Pos,player:Player){
 board[p.row][p.col]=player;
 const shapes=dirs.map(([dr,dc])=>shapeAt(board,p,player,dr,dc));
 board[p.row][p.col]=0;
 const scores=shapes.map(shapeScore).sort((a,b)=>b-a);
 // Multiple simultaneous threats are more valuable than one isolated line.
 return scores[0]+scores.slice(1).reduce((sum,value)=>sum+value*.45,0);
}
function positionalScore(p:Pos){const center=(BOARD_SIZE-1)/2;return 40-(Math.abs(p.row-center)+Math.abs(p.col-center))*4;}

/** Tactical CPU: immediate wins/blocks remain absolute, otherwise compare attack and defensive threat value. */
export function chooseCpuMove(board:Cell[][],legalCells:Pos[]=emptyCells(board)):Pos|null{
 const empty=legalCells.filter((p)=>board[p.row]?.[p.col]===0);if(!empty.length)return null;
 for(const player of [2,1] as Player[]){for(const p of empty){board[p.row][p.col]=player;const wins=isWin(board,p,player);board[p.row][p.col]=0;if(wins)return p;}}
 let best=empty[0],bestScore=-Infinity;
 for(const p of empty){
  const attack=tacticalScore(board,p,2),defense=tacticalScore(board,p,1);
  const score=attack*1.05+defense*1.15+positionalScore(p);
  if(score>bestScore){best=p;bestScore=score;}
 }
 return best;
}
