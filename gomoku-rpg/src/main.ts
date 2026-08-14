import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { BLINK_COST, BOARD_SIZE, Pos, chooseCpuMove, createBoard, isWin } from './game';
import { Locale, getMessages, loadLocale, nextLocale, saveLocale } from './i18n';
import { applyManaReward, manaReward } from './patterns';
import './style.css';

const app = new Application();
await app.init({ resizeTo: window, antialias: true, background: '#f3efe7', resolution: Math.min(devicePixelRatio, 2) });
document.querySelector('#app')!.appendChild(app.canvas);

type GameStatus = 'playing' | 'victory' | 'defeat' | 'draw';
let board = createBoard();
let mana = 0;
let turn = 1;
let locked = false;
let blinkMode = false;
let blinkFrom: Pos | null = null;
let gameStatus: GameStatus = 'playing';
let statusKey: 'yourTurn' | 'opponentTurn' | 'blink' | 'selectDestination' = 'yourTurn';
let locale: Locale = loadLocale();
let cpuTimer: ReturnType<typeof setTimeout> | null = null;

const root = new Container();
app.stage.addChild(root);
const ink = 0x24232b, muted = 0x9d968d, gold = 0xc9a35c, violet = 0x7450a9, paper = 0xf3efe7;
const style = (size:number, color=ink, weight='500') => new TextStyle({ fontFamily:'Georgia, "Noto Serif TC", serif', fontSize:size, fill:color, fontWeight:weight as any, letterSpacing:locale === 'zh-TW' ? 1 : 2 });
function label(text:string,x:number,y:number,size=14,color=ink,weight='500') { const t=new Text({text,style:style(size,color,weight)}); t.x=x;t.y=y;root.addChild(t);return t; }
function diamond(g:Graphics,x:number,y:number,r:number,color:number,fill=true){ g.moveTo(x,y-r).lineTo(x+r,y).lineTo(x,y+r).lineTo(x-r,y).closePath(); fill?g.fill(color):g.stroke({color,width:1}); }
function button(x:number,y:number,w:number,h:number,onTap:()=>void,active=false){ const g=new Graphics().roundRect(x,y,w,h,8).fill(active?0x292936:0xf8f5ef).stroke({color:active?gold:0xd8c8a7,width:1});g.eventMode='static';g.cursor='pointer';g.on('pointertap',onTap);root.addChild(g);return g; }

function currentStatusText() {
  const m=getMessages(locale);
  if(gameStatus==='victory') return m.victory;
  if(gameStatus==='defeat') return m.defeat;
  if(gameStatus==='draw') return m.draw;
  return m[statusKey];
}

function render(){
  root.removeChildren(); const m=getMessages(locale);
  const w=app.screen.width,h=app.screen.height;
  const scale=Math.min(w/390,h/844); root.scale.set(scale); root.x=(w-390*scale)/2; root.y=(h-844*scale)/2;
  root.addChild(new Graphics().rect(0,0,390,844).fill(paper));
  label(m.vsCpu,24,22,11,muted); label(m.opponent,24,61,15,ink,'600');
  button(292,18,74,28,toggleLocale); label(locale==='en'?'繁中':'EN',312,25,10,ink,'600');
  const enemy=new Graphics(); diamond(enemy,328,72,32,0x1f1e27); diamond(enemy,328,72,13,violet,false); root.addChild(enemy);
  label(m.mana,24,94,10,muted); const em=new Graphics(); for(let i=0;i<5;i++) diamond(em,76+i*18,101,6,i<1?violet:0xbab4ac,i<1); root.addChild(em);
  label(`${m.turn} ${String(turn).padStart(2,'0')}`,164,70,12,gold,'600');

  const boardX=24, boardY=145, boardW=342, pad=19, step=(boardW-pad*2)/(BOARD_SIZE-1);
  root.addChild(new Graphics().roundRect(boardX,boardY,boardW,342,8).fill(0xf8f5ef).stroke({color:0xd8c8a7,width:1}));
  const grid=new Graphics(); for(let i=0;i<BOARD_SIZE;i++){ const p=boardX+pad+i*step; grid.moveTo(p,boardY+pad).lineTo(p,boardY+342-pad); const py=boardY+pad+i*step; grid.moveTo(boardX+pad,py).lineTo(boardX+boardW-pad,py); } grid.stroke({color:0xb9b1a7,width:1}); root.addChild(grid);
  board.forEach((row,r)=>row.forEach((cell,c)=>{ const x=boardX+pad+c*step,y=boardY+pad+r*step; if(cell){ const stone=new Graphics().circle(x,y,12).fill(cell===1?0xfbf9f4:0x29282c).stroke({color:cell===1?0xd8d1c7:0x111116,width:1}); diamond(stone,x,y,3,gold); root.addChild(stone); } const hit=new Graphics().circle(x,y,17).fill({color:0xffffff,alpha:0.001}); hit.eventMode='static'; hit.cursor='pointer'; hit.on('pointertap',()=>onCell({row:r,col:c})); root.addChild(hit); }));

  root.addChild(new Graphics().roundRect(105,504,180,30,15).fill(0x292936)); const st=label(currentStatusText(),0,512,11,0xf3e6c9,'600'); st.x=195-st.width/2;
  const avatar=new Graphics(); diamond(avatar,55,581,34,0xffffff); diamond(avatar,55,581,13,gold,false);root.addChild(avatar);
  label(m.you,105,551,15,ink,'600'); label(m.mana,105,581,10,muted); const pm=new Graphics(); for(let i=0;i<5;i++) diamond(pm,155+i*18,588,6,i<mana?gold:0xbab4ac,i<mana);root.addChild(pm); label(m.gainMana,105,610,9,muted);

  if(gameStatus==='playing'){
    const skill=button(24,648,342,104,toggleBlink,blinkMode); skill.alpha=locked||mana<BLINK_COST?0.55:1;
    const icon=new Graphics(); diamond(icon,70,700,28,0x292936); diamond(icon,70,700,12,gold,false);root.addChild(icon);
    label(m.blink,112,670,14,ink,'600'); label(m.costMana(BLINK_COST),112,696,10,mana>=BLINK_COST?gold:muted,'600'); label(blinkMode?m.blinkSelect:m.blinkHelp,112,719,9,muted);
  } else {
    button(24,648,342,82,restartGame,true); const again=label(m.playAgain,0,678,14,0xf3e6c9,'600'); again.x=195-again.width/2;
  }
  const footer=label(m.footer,0,797,9,muted); footer.x=195-footer.width/2;
}

function toggleLocale(){ locale=nextLocale(locale); saveLocale(locale); render(); }
function restartGame(){ if(cpuTimer){clearTimeout(cpuTimer);cpuTimer=null;} board=createBoard();mana=0;turn=1;locked=false;blinkMode=false;blinkFrom=null;gameStatus='playing';statusKey='yourTurn';render(); }
function toggleBlink(){ if(locked||gameStatus!=='playing'||mana<BLINK_COST)return; blinkMode=!blinkMode;blinkFrom=null;statusKey=blinkMode?'blink':'yourTurn';render(); }
function onCell(p:Pos){ if(locked||gameStatus!=='playing')return; if(blinkMode){ if(!blinkFrom){ if(board[p.row][p.col]===1){blinkFrom=p;statusKey='selectDestination';render();} return; } if(board[p.row][p.col]!==0)return; board[blinkFrom.row][blinkFrom.col]=0;board[p.row][p.col]=1;mana-=BLINK_COST;blinkMode=false;blinkFrom=null;finishPlayer(p);return; } if(board[p.row][p.col]!==0)return; board[p.row][p.col]=1;mana=applyManaReward(mana,manaReward(board,p,1));finishPlayer(p); }
function finishPlayer(p:Pos){ if(isWin(board,p,1)){gameStatus='victory';locked=true;render();return;} locked=true;statusKey='opponentTurn';turn++;render();cpuTimer=setTimeout(cpuTurn,350); }
function cpuTurn(){ cpuTimer=null;const p=chooseCpuMove(board);if(!p){gameStatus='draw';locked=true;render();return;}board[p.row][p.col]=2;if(isWin(board,p,2)){gameStatus='defeat';locked=true;render();return;}locked=false;statusKey='yourTurn';render(); }

render(); window.addEventListener('resize',render);
