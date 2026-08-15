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

/** CPU evaluates only cells that the combat layer says are currently legal. */
export function chooseCpuMove(board:Cell[][],legalCells:Pos[]=emptyCells(board)):Pos|null{
 const empty=legalCells.filter((p)=>board[p.row]?.[p.col]===0);if(!empty.length)return null;
 for(const player of [2,1] as Player[]){for(const p of empty){board[p.row][p.col]=player;const wins=isWin(board,p,player);board[p.row][p.col]=0;if(wins)return p;}}
 const center=(BOARD_SIZE-1)/2;return [...empty].sort((a,b)=>(Math.abs(a.row-center)+Math.abs(a.col-center))-(Math.abs(b.row-center)+Math.abs(b.col-center)))[0];
}