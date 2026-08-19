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
function playerHeroCard(parent:Container,locale:Locale,id:HeroId,loadout:HeroLoadout,x:number,y:number,w:number,onChange?:()=>void){
  const h=106;
  const g=new Graphics().roundRect(x,y,w,h,10).fill(0xeee5fa).stroke({color:color.violet,width:2});parent.addChild(g);
  centered(parent,locale,heroGlyph[id],x+31,y+18,24,color.violet,'700');
  const m=getMessages(locale);uiText(parent,locale,m[heroes[id].nameKey],x+58,y+14,16,color.ink,'700');
  uiText(parent,locale,locale==='en'?role[id].en:role[id].zh,x+58,y+39,10,color.violet,'700');
  uiText(parent,locale,locale==='en'?'EQUIPPED':'目前編組',x+58,y+62,10,color.muted,'700');
  uiText(parent,locale,loadout.skills.map(s=>skillName[s]??s).join('  •  '),x+58,y+80,11,color.ink,'600');
  centered(parent,locale,'✓',x+w-24,y+25,14,color.violet,'700');
  if(onChange){
    const change=uiText(parent,locale,locale==='en'?'CHANGE':'更換',x+w-58,y+78,10,color.violet,'700');
    change.anchor.set(1,0);change.eventMode='static';change.cursor='pointer';change.on('pointertap',onChange);
  }
}
function compactHeroCard(parent:Container,locale:Locale,id:HeroId,x:number,y:number,w:number,selected:boolean,onTap:()=>void){
  const h=86;
  const g=new Graphics().roundRect(x,y,w,h,10).fill(selected?0xeee5fa:color.paperRaised).stroke({color:selected?color.violet:color.edge,width:selected?2:1});
  g.eventMode='static';g.cursor='pointer';g.on('pointertap',onTap);parent.addChild(g);
  centered(parent,locale,heroGlyph[id],x+w/2,y+10,20,selected?color.violet:color.gold,'700');
  const m=getMessages(locale);centered(parent,locale,m[heroes[id].nameKey],x+w/2,y+37,13,color.ink,'700');
  centered(parent,locale,locale==='en'?role[id].en:role[id].zh,x+w/2,y+59,9,selected?color.violet:color.muted,'700');
  if(selected){const mark=centered(parent,locale,'✓',x+w-13,y+8,11,color.violet,'700');mark.anchor.set(.5,0);}
}

export function renderBattleSetupVisual(parent:Container,locale:Locale,opts:{playerHeroId:HeroId;playerLoadout:HeroLoadout;cpuHeroId:HeroId;randomOpponent:boolean;onBack:()=>void;onPlayerHero?:(id:HeroId)=>void;onCpuHero:(id:HeroId)=>void;onRandom:()=>void;onContinue:()=>void}){
  pageHeader(parent,locale,locale==='en'?'Battle Setup':'對戰設定',opts.onBack);
  centered(parent,locale,locale==='en'?'PREPARE YOUR MATCH':'準備你的對局',195,70,11,color.gold,'700');
  section(parent,locale,locale==='en'?'YOUR HERO':'我方英雄',108);
  playerHeroCard(parent,locale,opts.playerHeroId,opts.playerLoadout,24,130,342,opts.onPlayerHero?()=>opts.onPlayerHero?.(heroIds[(heroIds.indexOf(opts.playerHeroId)+1)%heroIds.length]):undefined);
  section(parent,locale,locale==='en'?'CPU OPPONENT':'CPU 對手',258);
  const gap=8,cardW=(342-gap*2)/3;
  heroIds.forEach((id,i)=>compactHeroCard(parent,locale,id,24+i*(cardW+gap),282,cardW,!opts.randomOpponent&&opts.cpuHeroId===id,()=>opts.onCpuHero(id)));
  const randomY=382;const rg=new Graphics().roundRect(24,randomY,342,64,10).fill(opts.randomOpponent?color.panel:color.paperRaised).stroke({color:opts.randomOpponent?color.gold:color.edge,width:opts.randomOpponent?2:1});rg.eventMode='static';rg.cursor='pointer';rg.on('pointertap',opts.onRandom);parent.addChild(rg);
  uiText(parent,locale,'↻',42,randomY+17,22,opts.randomOpponent?color.goldSoft:color.violet,'700');
  uiText(parent,locale,locale==='en'?'RANDOM OPPONENT':'隨機對手',78,randomY+12,14,opts.randomOpponent?color.parchment:color.ink,'700');
  uiText(parent,locale,locale==='en'?'Identity stays hidden until battle':'進入對局後才揭曉身份',78,randomY+35,10,opts.randomOpponent?color.goldSoft:color.muted,'600');
  section(parent,locale,locale==='en'?'MATCH RULES':'對局規則',474);
  surface(parent,24,496,342,102,false);
  uiText(parent,locale,locale==='en'?'Rule Set':'規則',42,512,10,color.muted,'700');uiText(parent,locale,locale==='en'?'Standard · First to five':'標準 · 五連勝利',42,532,13,color.ink,'700');
  uiText(parent,locale,locale==='en'?'CPU Loadout':'CPU 編組',42,560,10,color.muted,'700');
  uiText(parent,locale,opts.randomOpponent?(locale==='en'?'Hidden · default kit':'隱藏 · 預設編組'):heroes[opts.cpuHeroId].defaultLoadout.skills.map(s=>skillName[s]??s).join('  •  '),42,578,11,color.violet,'600');
  actionButton(parent,locale,24,632,342,62,locale==='en'?'CONTINUE TO PREVIEW':'前往對戰確認',opts.onContinue,true);
  centered(parent,locale,opts.randomOpponent?(locale==='en'?'Random CPU remains hidden in preview.':'隨機 CPU 在確認頁仍保持隱藏。'):(locale==='en'?'Review both heroes before battle.':'開戰前確認雙方英雄與編組。'),195,710,10,color.muted,'600');
}
