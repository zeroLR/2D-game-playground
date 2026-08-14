import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { BLINK_COST, BOARD_SIZE, Cell, Player, Pos, chooseCpuMove, createBoard, earnsMana, isWin } from './game';
import './style.css';

const app = new Application();
await app.init({ resizeTo: window, antialias: true, background: '#f3efe7', resolution: Math.min(devicePixelRatio, 2) });
document.querySelector('#app')!.appendChild(app.canvas);

let board = createBoard();
let mana = 0;
let turn = 1;
let locked = false;
let blinkMode = false;
let blinkFrom: Pos | null = null;
let status = 'YOUR TURN';

const root = new Container();
app.stage.addChild(root);
const ink = 0x24232b, muted = 0x9d968d, gold = 0xc9a35c, violet = 0x7450a9, paper = 0xf3efe7;
const style = (size:number, color=ink, weight='500') => new TextStyle({ fontFamily:'Georgia, serif', fontSize:size, fill:color, fontWeight:weight as any, letterSpacing:2 });

function label(text:string,x:number,y:number,size=14,color=ink,weight='500') { const t=new Text({text,style:style(size,color,weight)}); t.x=x;t.y=y;root.addChild(t);return t; }
function diamond(g:Graphics,x:number,y:number,r:number,color:number,fill=true){ g.moveTo(x,y-r).lineTo(x+r,y).lineTo(x,y+r).lineTo(x-r,y).closePath(); fill?g.fill(color):g.stroke({color,width:1}); }

function render(){
  root.removeChildren();
  const w=app.screen.width,h=app.screen.height;
  const scale=Math.min(w/390,h/844); root.scale.set(scale); root.x=(w-390*scale)/2; root.y=(h-844*scale)/2;
  const bg=new Graphics().rect(0,0,390,844).fill(paper);root.addChild(bg);
  label('VS CPU  •  LV.1',24,22,11,muted); label('OPPONENT',24,61,15,ink,'600');
  const enemy=new Graphics(); diamond(enemy,328,72,32,0x1f1e27); diamond(enemy,328,72,13,violet,false); root.addChild(enemy);
  label('MANA',24,94,10,muted); const em=new Graphics(); for(let i=0;i<5;i++) diamond(em,76+i*18,101,6,i<1?violet:0xbab4ac,i<1); root.addChild(em);
  label(`TURN ${String(turn).padStart(2,'0')}`,164,70,12,gold,'600');

  const boardX=24, boardY=145, boardW=342, pad=19, step=(boardW-pad*2)/(BOARD_SIZE-1);
  const panel=new Graphics().roundRect(boardX,boardY,boardW,342,8).fill(0xf8f5ef).stroke({color:0xd8c8a7,width:1});root.addChild(panel);
  const grid=new Graphics();
  for(let i=0;i<BOARD_SIZE;i++){ const p=boardX+pad+i*step; grid.moveTo(p,boardY+pad).lineTo(p,boardY+342-pad); const py=boardY+pad+i*step; grid.moveTo(boardX+pad,py).lineTo(boardX+boardW-pad,py); }
  grid.stroke({color:0xb9b1a7,width:1}); root.addChild(grid);
  board.forEach((row,r)=>row.forEach((cell,c)=>{
    const x=boardX+pad+c*step,y=boardY+pad+r*step;
    if(cell){ const stone=new Graphics().circle(x,y,12).fill(cell===1?0xfbf9f4:0x29282c).stroke({color:cell===1?0xd8d1c7:0x111116,width:1}); diamond(stone,x,y,3,gold); root.addChild(stone); }
    const hit=new Graphics().circle(x,y,17).fill({color:0xffffff,alpha:0.001}); hit.eventMode='static'; hit.cursor='pointer'; hit.on('pointertap',()=>onCell({row:r,col:c})); root.addChild(hit);
  }));

  const turnBar=new Graphics().roundRect(119,504,152,30,15).fill(0x292936);root.addChild(turnBar); label(status,143,512,11,0xf3e6c9,'600');
  const avatar=new Graphics(); diamond(avatar,55,581,34,0xffffff); diamond(avatar,55,581,13,gold,false);root.addChild(avatar);
  label('YOU',105,551,15,ink,'600'); label('MANA',105,581,10,muted);
  const pm=new Graphics(); for(let i=0;i<5;i++) diamond(pm,155+i*18,588,6,i<mana?gold:0xbab4ac,i<mana);root.addChild(pm);
  label('Form a line of 3+ to gain Mana.',105,610,9,muted);

  const skill=new Graphics().roundRect(24,648,342,104,8).fill(0xf8f5ef).stroke({color:blinkMode?violet:0xd8c8a7,width:blinkMode?2:1}); skill.eventMode='static';skill.cursor='pointer';skill.on('pointertap',toggleBlink);root.addChild(skill);
  const icon=new Graphics(); diamond(icon,70,700,28,0x292936); diamond(icon,70,700,12,gold,false);root.addChild(icon);
  label('BLINK',112,670,14,ink,'600'); label(`COST  ${BLINK_COST} MANA`,112,696,10,mana>=BLINK_COST?gold:muted,'600'); label(blinkMode?'Select one of your stones, then an empty cell.':'Move one of your stones. Uses your whole turn.',112,719,9,muted);
  label('M0  •  9×9  •  FIVE IN A ROW',77,797,9,muted);
}

function toggleBlink(){ if(locked||mana<BLINK_COST)return; blinkMode=!blinkMode;blinkFrom=null;status=blinkMode?'BLINK':'YOUR TURN';render(); }
function onCell(p:Pos){
  if(locked)return;
  if(blinkMode){
    if(!blinkFrom){ if(board[p.row][p.col]===1){blinkFrom=p;status='SELECT DESTINATION';render();} return; }
    if(board[p.row][p.col]!==0)return;
    board[blinkFrom.row][blinkFrom.col]=0; board[p.row][p.col]=1; mana-=BLINK_COST; blinkMode=false;blinkFrom=null; finishPlayer(p); return;
  }
  if(board[p.row][p.col]!==0)return;
  board[p.row][p.col]=1; if(earnsMana(board,p,1)) mana=Math.min(5,mana+1); finishPlayer(p);
}
function finishPlayer(p:Pos){ if(isWin(board,p,1)){status='VICTORY';locked=true;render();return;} locked=true;status='OPPONENT';turn++;render();setTimeout(cpuTurn,350); }
function cpuTurn(){ const p=chooseCpuMove(board); if(!p){status='DRAW';render();return;} board[p.row][p.col]=2; if(isWin(board,p,2)){status='DEFEAT';locked=true;render();return;} locked=false;status='YOUR TURN';render(); }

render(); window.addEventListener('resize',render);