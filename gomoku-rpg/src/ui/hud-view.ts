import { Graphics } from 'pixi.js';
import { HeroDefinition } from '../heroes';
import { MANA_CAP } from '../patterns';
import { StatusKey } from '../runtime/presentation';
import { getMessages } from '../i18n';
import { ViewContext, CANVAS_CENTER, centeredLabel, diamond, gold, ink, label, muted, panel, parchment, violet } from './theme';

export interface HudTopProps{turn:number;onToggleLocale:()=>void}
export interface HudPanelProps{hero:HeroDefinition;mana:number;status:StatusKey;manaPulse:boolean;passivePulse:boolean;passiveBanner:boolean}

/** Opponent block, turn counter and the locale switch. */
export function renderHudTop(ctx:ViewContext,{turn,onToggleLocale}:HudTopProps){
  const m=getMessages(ctx.locale);
  label(ctx,m.vsCpu,24,22,11,muted);
  label(ctx,m.opponent,24,61,15,ink,'600');
  renderLocaleToggle(ctx,292,18,onToggleLocale);
  const enemy=new Graphics();diamond(enemy,328,72,32,0x1f1e27);diamond(enemy,328,72,13,violet,false);ctx.root.addChild(enemy);
  label(ctx,m.mana,24,94,10,muted);
  label(ctx,`${m.turn} ${String(turn).padStart(2,'0')}`,164,70,12,gold,'600');
}

export function renderLocaleToggle(ctx:ViewContext,x:number,y:number,onToggleLocale:()=>void){
  const g=new Graphics().roundRect(x,y,74,28,7).fill(0xf8f5ef).stroke({color:0xd8c8a7,width:1});
  g.eventMode='static';g.cursor='pointer';g.on('pointertap',onToggleLocale);ctx.root.addChild(g);
  label(ctx,ctx.locale==='en'?'繁中':'EN',x+20,y+7,10,ink,'600');
}

/** Passive banner, status pill and the hero block with its Mana track. */
export function renderHudPanel(ctx:ViewContext,{hero,mana,status,manaPulse,passivePulse,passiveBanner}:HudPanelProps){
  const m=getMessages(ctx.locale),{root}=ctx;
  if(passiveBanner){
    root.addChild(new Graphics().roundRect(119,455,152,26,13).fill({color:panel,alpha:.94}).stroke({color:gold,width:1}));
    centeredLabel(ctx,m[hero.passive],CANVAS_CENTER,462,9,gold,'600');
  }
  root.addChild(new Graphics().roundRect(105,504,180,30,15).fill(panel));
  centeredLabel(ctx,m[status],CANVAS_CENTER,512,11,parchment,'600');
  const avatar=new Graphics();diamond(avatar,55,581,34,0xffffff);diamond(avatar,55,581,13,gold,false);root.addChild(avatar);
  label(ctx,m[hero.nameKey],105,548,13,ink,'600');
  label(ctx,m[hero.role],105,568,8,muted,'600');
  label(ctx,m.mana,105,588,9,manaPulse?gold:muted);
  const pips=new Graphics();
  for(let i=0;i<MANA_CAP;i++)diamond(pips,155+i*18,595,manaPulse&&i<mana?7:6,i<mana?gold:0xbab4ac,i<mana);
  root.addChild(pips);
  label(ctx,`${m.passive} • ${m[hero.passive]}`,105,614,8,passivePulse?gold:muted);
}

export function renderFooter(ctx:ViewContext){centeredLabel(ctx,getMessages(ctx.locale).footer,CANVAS_CENTER,797,9,muted);}
