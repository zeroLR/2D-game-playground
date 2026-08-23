import { Graphics } from 'pixi.js';
import { SkillId } from '../skills';
import { SkillBarItem } from '../runtime/presentation';
import { Messages, getMessages } from '../i18n';
import { ViewContext, button, centeredLabel, diamond, gold, ink, label, muted, parchment, violet } from './theme';

export interface SkillBarProps{items:SkillBarItem[];onSelect:(skillId:SkillId)=>void}
export interface MatchOverProps{summaryCopied:boolean;onRestart:()=>void;onChooseHero:()=>void;onCopySummary:()=>void}
const SKILL_Y=648,SKILL_W=168,SKILL_H=82,SKILL_GAP=6;
function activationText(ctx:ViewContext,item:SkillBarItem){
  const m=getMessages(ctx.locale);
  if(item.activation.kind==='cooldown')return item.cooldownRemaining>0?(ctx.locale==='en'?`CD ${item.cooldownRemaining}`:`冷卻 ${item.cooldownRemaining}`):(ctx.locale==='en'?`READY · CD ${item.activation.turns}`:`可用 · 冷卻 ${item.activation.turns}`);
  if(item.activation.kind==='resource'&&item.activation.resourceId==='mana')return m.costMana(item.activation.amount);
  if(item.activation.kind==='resource'&&item.activation.resourceId==='pressure')return ctx.locale==='en'?`PRESSURE ${item.resourceCurrent}/${item.resourceMax} · COST ${item.activation.amount}`:`壓迫 ${item.resourceCurrent}/${item.resourceMax} · 消耗 ${item.activation.amount}`;
  if(item.activation.kind==='condition')return item.conditionReady?(ctx.locale==='en'?'FORMATION READY':'陣型就緒'):(ctx.locale==='en'?'BUILD FORMATION':'建立陣型');
  return item.enabled?(ctx.locale==='en'?'READY':'可使用'):(ctx.locale==='en'?'LOCKED':'未就緒');
}
/** Active skill buttons. Availability comes from the presentation model. */
export function renderSkillBar(ctx:ViewContext,{items,onSelect}:SkillBarProps){
  const m=getMessages(ctx.locale);
  items.forEach((item,i)=>{const x=24+i*(SKILL_W+SKILL_GAP);const face=button(ctx,x,SKILL_Y,SKILL_W,SKILL_H,()=>onSelect(item.skillId),item.selected);face.alpha=item.enabled?1:.55;label(ctx,m[item.skillId],x+12,662,11,item.selected?parchment:ink,'600');label(ctx,activationText(ctx,item),x+12,684,8,item.selected?gold:muted,'600');const marker=new Graphics();diamond(marker,x+145,671,8,item.selected?gold:violet,false);ctx.root.addChild(marker);});
  const selected=items.find((item)=>item.selected);if(selected){const help=label(ctx,m[selected.descriptionKey as keyof Messages] as string,24,739,8,muted);help.style.wordWrap=true;help.style.wordWrapWidth=342;}
}
export function renderMatchOverBar(ctx:ViewContext,{summaryCopied,onRestart,onChooseHero,onCopySummary}:MatchOverProps){const m=getMessages(ctx.locale),english=ctx.locale==='en';button(ctx,24,SKILL_Y,126,SKILL_H,onRestart,true);centeredLabel(ctx,m.playAgain,87,678,10,parchment,'600');button(ctx,158,SKILL_Y,98,SKILL_H,onChooseHero);centeredLabel(ctx,m.changeHero,207,678,8,ink,'600');button(ctx,264,SKILL_Y,102,SKILL_H,onCopySummary);centeredLabel(ctx,summaryCopied?(english?'COPIED':'已複製'):(english?'METRICS':'數據摘要'),315,678,8,ink,'600');}
