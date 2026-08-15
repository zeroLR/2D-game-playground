import { Graphics } from 'pixi.js';
import { HeroId, PassiveId, heroes } from '../heroes';
import { SkillId } from '../skills';
import { Messages, getMessages } from '../i18n';
import { ViewContext, CANVAS_CENTER, button, centeredLabel, diamond, gold, ink, label, muted, parchment, violet } from './theme';
import { renderLocaleToggle } from './hud-view';

export interface HeroSelectProps{selectedHero:HeroId;onSelectHero:(heroId:HeroId)=>void;onStart:()=>void;onToggleLocale:()=>void}

const HERO_ORDER:HeroId[]=['vanguard','arcanist','shade'];
/** Passives that ship with an explanatory line; the rest render name only. */
const PASSIVE_HELP:Partial<Record<PassiveId,keyof Messages>>={fortified:'fortifiedHelp',flow:'flowHelp'};

export function renderHeroSelect(ctx:ViewContext,{selectedHero,onSelectHero,onStart,onToggleLocale}:HeroSelectProps){
  const m=getMessages(ctx.locale),skillName=(id:SkillId)=>m[id];
  label(ctx,m.title,24,38,25,ink,'600');
  label(ctx,m.titleTagline,24,78,10,muted);
  renderLocaleToggle(ctx,292,28,onToggleLocale);
  label(ctx,m.chooseHero,24,132,11,gold,'600');
  HERO_ORDER.forEach((id,i)=>{
    const hero=heroes[id],y=170+i*150,active=selectedHero===id;
    button(ctx,24,y,342,128,()=>onSelectHero(id),active);
    const crest=new Graphics();diamond(crest,65,y+45,24,active?gold:violet,false);diamond(crest,65,y+45,8,active?gold:violet);ctx.root.addChild(crest);
    label(ctx,m[hero.nameKey],105,y+20,15,active?parchment:ink,'600');
    label(ctx,m[hero.role],105,y+47,9,active?gold:muted,'600');
    label(ctx,`${m.passive}  •  ${m[hero.passive]}`,105,y+70,8,active?parchment:muted);
    label(ctx,`${m.skillsLabel}  •  ${hero.activeSkills.map(skillName).join(' / ')}`,105,y+91,8,active?parchment:muted);
    const helpKey=PASSIVE_HELP[hero.passive];
    if(helpKey){const help=label(ctx,m[helpKey] as string,105,y+108,7,active?parchment:muted);help.style.wordWrap=true;help.style.wordWrapWidth=245;}
  });
  button(ctx,24,650,342,72,onStart,true);
  centeredLabel(ctx,m.startBattle,CANVAS_CENTER,676,14,parchment,'600');
}
