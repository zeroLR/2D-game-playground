import { Container,Graphics } from 'pixi.js';
import { HeroId,HeroLoadout,heroIds,heroes } from '../heroes';
import { getMessages,Locale } from '../i18n';
import { actionButton,pageHeader,surface,uiText } from './design/components';
import { color,type } from './design/tokens';

const skillName:Record<string,string>={blink:'Blink',charge:'Charge',phase:'Flame',corrupt:'Corrupt'};
const heroGlyph:Record<HeroId,string>={vanguard:'◆',arcanist:'✦',shade:'◇'};
const role:Record<HeroId,{en:string;zh:string}>={vanguard:{en:'FRONTLINE',zh:'前衛'},arcanist:{en:'CONTROL',zh:'控場'},shade:{en:'DISRUPTION',zh:'擾亂'}};

function centered(parent:Container,locale:Locale,value:string,x:number,y:number,size:number=type.body,fill:number=color.ink,weight='600'){
  const t=uiText(parent,locale,value,0,y,size,fill,weight);t.anchor.set(.5,0);t.x=x;return t;
}
function section(parent:Container,locale:Locale,value:string,y:number){return uiText(parent,locale,value,24,y,type.caption,color.gold,'700');}
function heroCard(parent:Container,locale:Locale,id:HeroId,x:number,y:number,w:number,selected:boolean,onTap?:()=>void){
  const g=new Graphics().roundRect(x,y,w,84,10).fill(selected?0xeee5fa:color.paperRaised).stroke({color:selected?color.violet:color.edge,width:selected?2:1});
  if(onTap){g.eventMode='static';g.cursor='pointer';g.on('pointertap',onTap);} parent.addChild(g);
  centered(parent,locale,heroGlyph[id],x+31,y+15,24,selected?color.violet:color.gold,'700');
  const m=getMessages(locale);uiText(parent,locale,m[heroes[id].nameKey],x+58,y+14,16,color.ink,'700');
  uiText(parent,locale,locale==='en'?role[id].en:role[id].zh,x+58,y+39,10,selected?color.violet:color.muted,'700');
  if(selected) centered(parent,locale,'✓',x+w-24,y+28,14,color.violet,'700');
  return g;
}
function kitLine(parent:Container,locale:Locale,loadout:HeroLoadout,x:number,y:number){
  uiText(parent,locale,locale==='en'?'EQUIPPED':'目前編組',x,y,10,color.muted,'700');
  uiText(parent,locale,loadout.skills.map(s=>skillName[s]??s).join('  •  '),x,y+20,11,color.ink,'600');
}

export function renderBattleSetupVisual(parent:Container,locale:Locale,opts:{playerHeroId:HeroId;playerLoadout:HeroLoadout;cpuHeroId:HeroId;randomOpponent:boolean;onBack:()=>void;onPlayerHero?:(id:HeroId)=>void;onCpuHero:(id:HeroId)=>void;onRandom:()=>void;onContinue:()=>void}){
  pageHeader(parent,locale,locale==='en'?'Battle Setup':'對戰設定',opts.onBack);
  centered(parent,locale,locale==='en'?'PREPARE YOUR MATCH':'準備你的對局',195,70,11,color.gold,'700');
  section(parent,locale,locale==='en'?'YOUR HERO':'我方英雄',108);
  heroCard(parent,locale,opts.playerHeroId,24,130,342,true);
  kitLine(parent,locale,opts.playerLoadout,82,188);
  if(opts.onPlayerHero){
    const change=uiText(parent,locale,locale==='en'?'CHANGE':'更換',292,188,10,color.violet,'700');change.eventMode='static';change.cursor='pointer';
    change.on('pointertap',()=>opts.onPlayerHero?.(heroIds[(heroIds.indexOf(opts.playerHeroId)+1)%heroIds.length]));
  }
  section(parent,locale,locale==='en'?'CPU OPPONENT':'CPU 對手',244);
  const gap=8,cardW=(342-gap*2)/3;
  heroIds.forEach((id,i)=>heroCard(parent,locale,id,24+i*(cardW+gap),268,cardW,!opts.randomOpponent&&opts.cpuHeroId===id,()=>opts.onCpuHero(id)));
  const randomY=364;const rg=new Graphics().roundRect(24,randomY,342,64,10).fill(opts.randomOpponent?color.panel:color.paperRaised).stroke({color:opts.randomOpponent?color.gold:color.edge,width:opts.randomOpponent?2:1});rg.eventMode='static';rg.cursor='pointer';rg.on('pointertap',opts.onRandom);parent.addChild(rg);
  uiText(parent,locale,'↻',42,randomY+17,22,opts.randomOpponent?color.goldSoft:color.violet,'700');
  uiText(parent,locale,locale==='en'?'RANDOM OPPONENT':'隨機對手',78,randomY+12,14,opts.randomOpponent?color.parchment:color.ink,'700');
  uiText(parent,locale,locale==='en'?'Identity stays hidden until battle':'進入對局後才揭曉身份',78,randomY+35,10,opts.randomOpponent?color.goldSoft:color.muted,'600');
  section(parent,locale,locale==='en'?'MATCH RULES':'對局規則',462);
  surface(parent,24,484,342,102,false);
  uiText(parent,locale,locale==='en'?'Rule Set':'規則',42,500,10,color.muted,'700');uiText(parent,locale,locale==='en'?'Standard · First to five':'標準 · 五連勝利',42,520,13,color.ink,'700');
  uiText(parent,locale,locale==='en'?'CPU Loadout':'CPU 編組',42,548,10,color.muted,'700');
  uiText(parent,locale,opts.randomOpponent?(locale==='en'?'Hidden · default kit':'隱藏 · 預設編組'):heroes[opts.cpuHeroId].defaultLoadout.skills.map(s=>skillName[s]??s).join('  •  '),42,566,11,color.violet,'600');
  actionButton(parent,locale,24,620,342,62,locale==='en'?'CONTINUE TO PREVIEW':'前往對戰確認',opts.onContinue,true);
  centered(parent,locale,opts.randomOpponent?(locale==='en'?'Random CPU remains hidden in preview.':'隨機 CPU 在確認頁仍保持隱藏。'):(locale==='en'?'Review both heroes before battle.':'開戰前確認雙方英雄與編組。'),195,698,10,color.muted,'600');
}
