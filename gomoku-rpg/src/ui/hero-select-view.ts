import { Graphics } from 'pixi.js';
import { HeroId, PassiveId, heroes } from '../heroes';
import { SkillId } from '../skills';
import { Messages, getMessages } from '../i18n';
import { ViewContext, CANVAS_CENTER, button, centeredLabel, diamond, gold, ink, label, muted, parchment, violet } from './theme';

export interface HeroSelectProps{selectedHero:HeroId;onSelectHero:(heroId:HeroId)=>void;onStart:()=>void;onBack:()=>void}
const HERO_ORDER:HeroId[]=['vanguard','arcanist','shade'];
const PASSIVE_HELP:Partial<Record<PassiveId,keyof Messages>>={fortified:'fortifiedHelp',flow:'flowHelp'};

export function renderHeroSelect(ctx:ViewContext,{selectedHero,onSelectHero,onStart,onBack}:HeroSelectProps){
  const m=getMessages(ctx.locale),skillName=(id:SkillId)=>m[id];
  button(ctx,18,24,46,40,onBack);centeredLabel(ctx,'‹',41,28,30,ink,'700');
  label(ctx,ctx.locale==='en'?'Choose Hero':'選擇英雄',78,31,22,ink,'700');
  centeredLabel(ctx,'VS CPU',CANVAS_CENTER,82,11,gold,'700');
  HERO_ORDER.forEach((id,i)=>{
    const hero=heroes[id],y=122+i*150,active=selectedHero===id;
    button(ctx,24,y,342,128,()=>onSelectHero(id),active);
    const crest=new Graphics();diamond(crest,65,y+45,24,active?gold:violet,false);diamond(crest,65,y+45,8,active?gold:violet);ctx.root.addChild(crest);
    label(ctx,m[hero.nameKey],105,y+20,15,active?parchment:ink,'600');label(ctx,m[hero.role],105,y+47,9,active?gold:muted,'600');
    label(ctx,`${m.passive}  •  ${m[hero.passive]}`,105,y+70,8,active?parchment:muted);label(ctx,`${m.skillsLabel}  •  ${hero.activeSkills.map(skillName).join(' / ')}`,105,y+91,8,active?parchment:muted);
    const helpKey=PASSIVE_HELP[hero.passive];if(helpKey){const help=label(ctx,m[helpKey] as string,105,y+108,7,active?parchment:muted);help.style.wordWrap=true;help.style.wordWrapWidth=245;}
  });
  button(ctx,24,600,342,68,onStart,true);centeredLabel(ctx,ctx.locale==='en'?'CONFIRM HERO':'確認英雄',CANVAS_CENTER,622,14,parchment,'600');
}
