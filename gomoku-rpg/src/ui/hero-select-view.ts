import { Graphics } from 'pixi.js';
import { HeroId, PassiveId, heroes } from '../heroes';
import { SkillId } from '../skills';
import { Messages, getMessages } from '../i18n';
import { ViewContext, CANVAS_CENTER, button, centeredLabel, diamond, gold, ink, label, muted, parchment, violet } from './theme';

export interface HeroSelectProps{selectedHero:HeroId;onSelectHero:(heroId:HeroId)=>void;onStart:()=>void;onBack:()=>void}
const HERO_ORDER:HeroId[]=['vanguard','arcanist','shade','architect','swordmaster'];
const PASSIVE_HELP:Partial<Record<PassiveId,keyof Messages>>={fortified:'fortifiedHelp',flow:'flowHelp',pressure:'pressureHelp',formation:'formationHelp',momentum:'momentumHelp'};

export function renderHeroSelect(ctx:ViewContext,{selectedHero,onSelectHero,onStart,onBack}:HeroSelectProps){
  const m=getMessages(ctx.locale),skillName=(id:SkillId)=>m[id];
  button(ctx,18,24,46,40,onBack);centeredLabel(ctx,'‹',41,28,30,ink,'700');
  label(ctx,ctx.locale==='en'?'Choose Hero':'選擇英雄',78,31,22,ink,'700');
  centeredLabel(ctx,'VS CPU',CANVAS_CENTER,74,10,gold,'700');
  HERO_ORDER.forEach((id,i)=>{
    const hero=heroes[id],y=94+i*96,active=selectedHero===id;
    button(ctx,24,y,342,84,()=>onSelectHero(id),active);
    const crest=new Graphics();diamond(crest,61,y+34,19,active?gold:violet,false);diamond(crest,61,y+34,6,active?gold:violet);ctx.root.addChild(crest);
    label(ctx,m[hero.nameKey],96,y+10,13,active?parchment:ink,'600');label(ctx,m[hero.role],96,y+29,8,active?gold:muted,'600');
    label(ctx,`${m.passive} • ${m[hero.passive]}`,96,y+46,8,active?parchment:muted);label(ctx,`${m.skillsLabel} • ${hero.defaultLoadout.skillIds.map(skillName).join(' / ')}`,96,y+62,8,active?parchment:muted);
  });
  const selected=heroes[selectedHero],helpKey=PASSIVE_HELP[selected.passive];if(helpKey){const help=label(ctx,m[helpKey] as string,28,582,8,muted);help.style.wordWrap=true;help.style.wordWrapWidth=334;}
  button(ctx,24,626,342,62,onStart,true);centeredLabel(ctx,ctx.locale==='en'?'CONFIRM HERO':'確認英雄',CANVAS_CENTER,646,14,parchment,'600');
}
