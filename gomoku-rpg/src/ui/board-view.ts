import { Graphics } from 'pixi.js';
import { BOARD_SIZE, Pos } from '../game';
import { CombatState, isGuarded, isSealed, samePos } from '../combat';
import { TargetingHighlights } from '../runtime/targeting';
import { ViewContext, card, diamond, edge, gold, line, violet } from './theme';

export const BOARD_X=24,BOARD_Y=145,BOARD_SPAN=342,BOARD_PAD=19;
const STEP=(BOARD_SPAN-BOARD_PAD*2)/(BOARD_SIZE-1);

/** Transient marks the board draws on top of state. Owned by the feedback layer, never by rules. */
export interface BoardFeedback{lastMove:Pos|null;winCells:Pos[];actionPulse:Pos|null;passivePulse:Pos|null;flash:Pos|null}
export interface BoardViewProps{state:CombatState;highlights:TargetingHighlights;feedback:BoardFeedback;onCell:(pos:Pos)=>void}

export const cellX=(col:number)=>BOARD_X+BOARD_PAD+col*STEP;
export const cellY=(row:number)=>BOARD_Y+BOARD_PAD+row*STEP;
const marks=(list:Pos[],pos:Pos)=>list.some((p)=>samePos(p,pos));

/** Vanguard Guard marker: a layered crystal shell around a protected stone. */
export function crystalArmor(x:number,y:number,active=false){
  const g=new Graphics();const outer=active?23:20,inner=active?15:14;
  diamond(g,x,y,outer,gold,false);diamond(g,x,y,inner,gold,false);
  const shard=(cx:number,cy:number,dx:number,dy:number)=>{g.moveTo(cx,cy).lineTo(cx+dx*7,cy+dy*7).lineTo(cx+dx*3-dy*4,cy+dy*3+dx*4).closePath().fill({color:gold,alpha:active?.72:.42});};
  shard(x,y-outer+2,0,-1);shard(x+outer-2,y,1,0);shard(x,y+outer-2,0,1);shard(x-outer+2,y,-1,0);
  g.circle(x,y,outer+3).stroke({color:gold,width:1,alpha:active?.38:.16});
  return g;
}

function renderGrid({root}:ViewContext){
  root.addChild(new Graphics().roundRect(BOARD_X,BOARD_Y,BOARD_SPAN,BOARD_SPAN,8).fill(card).stroke({color:edge,width:1}));
  const grid=new Graphics();
  for(let i=0;i<BOARD_SIZE;i++){
    const x=cellX(i);grid.moveTo(x,BOARD_Y+BOARD_PAD).lineTo(x,BOARD_Y+BOARD_SPAN-BOARD_PAD);
    const y=cellY(i);grid.moveTo(BOARD_X+BOARD_PAD,y).lineTo(BOARD_X+BOARD_SPAN-BOARD_PAD,y);
  }
  grid.stroke({color:line,width:1});root.addChild(grid);
}

export function renderBoard(ctx:ViewContext,{state,highlights,feedback,onCell}:BoardViewProps){
  const {root}=ctx;
  renderGrid(ctx);
  state.board.forEach((row,r)=>row.forEach((cell,c)=>{
    const x=cellX(c),y=cellY(r),pos={row:r,col:c};
    if(marks(feedback.winCells,pos))root.addChild(new Graphics().circle(x,y,18).fill({color:gold,alpha:.22}).stroke({color:gold,width:2}));
    if(isSealed(state,pos)){const g=new Graphics();diamond(g,x,y,11,violet,false);g.moveTo(x-7,y).lineTo(x+7,y).stroke({color:violet,width:2});root.addChild(g);}
    if(marks(highlights.sources,pos)||marks(highlights.targets,pos))root.addChild(new Graphics().circle(x,y,16).fill({color:gold,alpha:.16}).stroke({color:gold,width:1}));
    if(cell){
      if(isGuarded(state,pos))root.addChild(crystalArmor(x,y,!!feedback.passivePulse&&samePos(feedback.passivePulse,pos)));
      const stone=new Graphics().circle(x,y,12).fill(cell===1?0xfbf9f4:0x29282c).stroke({color:cell===1?0xd8d1c7:0x111116,width:1});
      diamond(stone,x,y,3,gold);root.addChild(stone);
    }
    if(feedback.lastMove&&samePos(feedback.lastMove,pos))root.addChild(new Graphics().circle(x,y,15).stroke({color:cell===1?gold:violet,width:1,alpha:.75}));
    if(feedback.actionPulse&&samePos(feedback.actionPulse,pos))root.addChild(new Graphics().circle(x,y,21).stroke({color:gold,width:2,alpha:.8}));
    if(feedback.passivePulse&&samePos(feedback.passivePulse,pos))root.addChild(new Graphics().circle(x,y,29).stroke({color:gold,width:2,alpha:.55}));
    if(feedback.flash&&samePos(feedback.flash,pos))root.addChild(new Graphics().circle(x,y,19).stroke({color:violet,width:2}));
    const hit=new Graphics().circle(x,y,17).fill({color:0xffffff,alpha:.001});
    hit.eventMode='static';hit.cursor='pointer';hit.on('pointertap',()=>onCell(pos));root.addChild(hit);
  }));
}
