import { Graphics } from 'pixi.js';
import { HeroId,heroes } from '../heroes';
import { getMessages } from '../i18n';
import { actionButton,pageHeader,surface,uiText } from './design/components';
import { color,type } from './design/tokens';
import { ViewContext,CANVAS_CENTER,button,centeredLabel,edge,gold,ink,label,muted,violet } from './theme';

export type BattleMode='cpu'|'local'|'online';

function header(ctx:ViewContext,title:string,onBack:()=>void){button(ctx,18,24,46,40,onBack);centeredLabel(ctx,'‹',41,28,30,ink,'700');label(ctx,title,78,31,22,ink,'700');}
function action(ctx:ViewContext,text:string,y:number,onTap:()=>void,active=false,sub?:string){button(ctx,34,y,322,92,onTap,active);centeredLabel(ctx,text,CANVAS_CENTER,y+23,20,active?0xf3e6c9:ink,'700');if(sub)centeredLabel(ctx,sub,CANVAS_CENTER,y+54,11,active?0xd8c8a7:muted);}
function visualCentered(ctx:ViewContext,value:string,x:number,y:number,size:number=type.body,fill:number=color.ink,weight='600'){const t=uiText(ctx.root,ctx.locale,value,0,y,size,fill,weight);t.anchor.set(.5,0);t.x=x;return t;}

export function renderModeSelect(ctx:ViewContext,opts:{onBack:()=>void;onMode:(mode:BattleMode)=>void}){header(ctx,ctx.locale==='en'?'Battle':'對戰模式',opts.onBack);centeredLabel(ctx,ctx.locale==='en'?'CHOOSE YOUR BATTLE': '選擇對戰方式',CANVAS_CENTER,105,13,gold,'700');action(ctx,'VS CPU',150,()=>opts.onMode('cpu'),true,ctx.locale==='en'?'Battle a computer hero':'與電腦英雄進行對戰');action(ctx,ctx.locale==='en'?'LOCAL PLAYER':'本機雙人',258,()=>opts.onMode('local'),false,ctx.locale==='en'?'Take turns on this device':'同裝置輪流操作');action(ctx,ctx.locale==='en'?'ONLINE PLAYER':'線上對戰',366,()=>opts.onMode('online'),false,ctx.locale==='en'?'Create or join a room':'建立或加入房間');centeredLabel(ctx,ctx.locale==='en'?'Online multiplayer is reserved for a future slice.':'線上多人模式將於後續版本開放。',CANVAS_CENTER,493,11,muted);}

export function renderBattlePreview(ctx:ViewContext,opts:{heroId:HeroId;cpuHeroId:HeroId;randomOpponent?:boolean;onBack:()=>void;onStart:()=>void}){
  const {root}=ctx,m=getMessages(ctx.locale),hero=heroes[opts.heroId],cpu=heroes[opts.cpuHeroId];
  pageHeader(root,ctx.locale,ctx.locale==='en'?'Battle Preview':'對戰確認',opts.onBack);
  visualCentered(ctx,ctx.locale==='en'?'READY FOR BATTLE':'準備對戰',195,72,11,color.gold,'700');
  surface(root,24,122,342,300,true);
  visualCentered(ctx,'◆',96,158,34,color.violet,'700');
  visualCentered(ctx,'VS',195,180,18,color.gold,'700');
  visualCentered(ctx,opts.randomOpponent?'?':'◇',294,158,34,opts.randomOpponent?color.muted:color.gold,'700');
  visualCentered(ctx,m[hero.nameKey],96,218,16,color.ink,'700');
  visualCentered(ctx,opts.randomOpponent?'???':m[cpu.nameKey],294,218,16,color.ink,'700');
  visualCentered(ctx,ctx.locale==='en'?'YOU':'你',96,246,10,color.violet,'700');
  visualCentered(ctx,opts.randomOpponent?(ctx.locale==='en'?'RANDOM CPU':'隨機 CPU'):'CPU',294,246,10,color.gold,'700');
  root.addChild(new Graphics().rect(48,286,294,1).fill(color.edge));
  uiText(root,ctx.locale,ctx.locale==='en'?'Your Loadout':'我方編組',48,306,10,color.muted,'700');
  uiText(root,ctx.locale,hero.defaultLoadout.skills.join('  •  '),48,328,11,color.ink,'600');
  uiText(root,ctx.locale,ctx.locale==='en'?'Opponent':'對手',48,358,10,color.muted,'700');
  uiText(root,ctx.locale,opts.randomOpponent?(ctx.locale==='en'?'Hidden until battle starts':'開戰後才揭曉'):cpu.defaultLoadout.skills.join('  •  '),48,380,11,opts.randomOpponent?color.gold:color.ink,'600');
  if(opts.randomOpponent) visualCentered(ctx,ctx.locale==='en'?'No reveal in preview · one draw when battle begins':'確認頁不揭曉 · 進入對局時抽選一次',195,454,10,color.muted,'600');
  actionButton(root,ctx.locale,24,500,342,66,ctx.locale==='en'?'START BATTLE':'開始對戰',opts.onStart,true);
  actionButton(root,ctx.locale,24,582,342,52,ctx.locale==='en'?'BACK TO SETUP':'返回設定',opts.onBack,false);
}

export function renderPauseOverlay(ctx:ViewContext,opts:{onResume:()=>void;onRestart:()=>void;onQuit:()=>void}){const shade=new Graphics().rect(0,0,390,844).fill({color:0x15141b,alpha:.72});ctx.root.addChild(shade);const cardX=46,cardY=224,cardW=298,cardH=352;const card=new Graphics().roundRect(cardX,cardY,cardW,cardH,12).fill(0xf8f5ef).stroke({color:edge,width:1});ctx.root.addChild(card);centeredLabel(ctx,ctx.locale==='en'?'PAUSED':'暫停',CANVAS_CENTER,258,25,ink,'700');button(ctx,70,318,250,64,opts.onResume,true);centeredLabel(ctx,ctx.locale==='en'?'Resume':'繼續對戰',CANVAS_CENTER,338,18,0xf3e6c9,'700');button(ctx,70,398,250,58,opts.onRestart);centeredLabel(ctx,ctx.locale==='en'?'Restart':'重新開始',CANVAS_CENTER,416,16,ink,'700');ctx.root.addChild(new Graphics().rect(70,476,250,1).fill(edge));button(ctx,70,496,250,48,opts.onQuit);centeredLabel(ctx,ctx.locale==='en'?'Surrender / Main Menu':'放棄對局 / 返回主選單',CANVAS_CENTER,510,12,0xa4473d,'700');}

export function renderResultOverlay(ctx:ViewContext,opts:{result:string;turns:number;onRematch:()=>void;onChangeHero:()=>void;onHome:()=>void}){const shade=new Graphics().rect(0,0,390,844).fill({color:0x15141b,alpha:.76});ctx.root.addChild(shade);const card=new Graphics().roundRect(28,158,334,500,12).fill(0xf8f5ef).stroke({color:gold,width:1});ctx.root.addChild(card);const victory=opts.result==='player-won';centeredLabel(ctx,victory?'VICTORY':opts.result==='draw'?'DRAW':'DEFEAT',CANVAS_CENTER,205,28,victory?violet:0xa4473d,'700');centeredLabel(ctx,ctx.locale==='en'?`${opts.turns} turns`:`${opts.turns} 回合`,CANVAS_CENTER,259,13,muted);button(ctx,54,334,282,66,opts.onRematch,true);centeredLabel(ctx,ctx.locale==='en'?'REMATCH':'再戰一場',CANVAS_CENTER,355,18,0xf3e6c9,'700');button(ctx,54,418,282,58,opts.onChangeHero);centeredLabel(ctx,ctx.locale==='en'?'Change Hero':'更換英雄',CANVAS_CENTER,436,15,ink,'700');button(ctx,54,492,282,58,opts.onHome);centeredLabel(ctx,ctx.locale==='en'?'Main Menu':'返回主選單',CANVAS_CENTER,510,15,ink,'700');}
