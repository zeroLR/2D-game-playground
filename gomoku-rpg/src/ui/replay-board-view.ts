import { Container,Graphics } from 'pixi.js';
import { Cell } from '../game';
import { ReplayEffect } from '../replay';
import { color } from './design/tokens';

export interface ReplayBoardViewProps{x:number;y:number;size:number;board:Cell[][];effects?:readonly ReplayEffect[];phase?:'before'|'impact'|'after';winningLine?:readonly {row:number;col:number}[];}
export function renderReplayBoardView(root:Container,p:ReplayBoardViewProps){
 const cell=p.size/9,g=new Graphics().roundRect(p.x-8,p.y-8,p.size+16,p.size+16,4).fill(color.paper).stroke({color:color.edge,width:1});
 for(let i=0;i<9;i++){const q=i*cell+cell/2;g.moveTo(p.x+cell/2,p.y+q).lineTo(p.x+p.size-cell/2,p.y+q).moveTo(p.x+q,p.y+cell/2).lineTo(p.x+q,p.y+p.size-cell/2);}g.stroke({color:color.line,width:1});root.addChild(g);
 p.board.forEach((row,r)=>row.forEach((stone,c)=>{if(!stone)return;root.addChild(new Graphics().circle(p.x+c*cell+cell/2,p.y+r*cell+cell/2,cell*.32).fill(stone===1?color.paperRaised:color.ink).stroke({color:color.line,width:1}));}));
 if(p.phase==='impact')for(const effect of p.effects??[]){const target=new Graphics().circle(p.x+effect.at.col*cell+cell/2,p.y+effect.at.row*cell+cell/2,cell*.43).stroke({color:effect.kind==='remove'?color.danger:color.violet,width:3});root.addChild(target);if(effect.source){root.addChild(new Graphics().moveTo(p.x+effect.source.col*cell+cell/2,p.y+effect.source.row*cell+cell/2).lineTo(p.x+effect.at.col*cell+cell/2,p.y+effect.at.row*cell+cell/2).stroke({color:color.gold,width:3,alpha:.8}));}}
 if(p.phase==='after'&&p.effects?.length){const last=p.effects[p.effects.length-1];root.addChild(new Graphics().circle(p.x+last.at.col*cell+cell/2,p.y+last.at.row*cell+cell/2,cell*.42).stroke({color:color.violet,width:2}));}
 if(p.winningLine?.length){const first=p.winningLine[0],last=p.winningLine[p.winningLine.length-1];root.addChild(new Graphics().moveTo(p.x+first.col*cell+cell/2,p.y+first.row*cell+cell/2).lineTo(p.x+last.col*cell+cell/2,p.y+last.row*cell+cell/2).stroke({color:color.gold,width:5,alpha:.75}));}
}
