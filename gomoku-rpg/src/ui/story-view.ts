import { Graphics } from 'pixi.js';
import type { GameSaveV1 } from '../save-game';
import { EASY_STORY_ENCOUNTERS,isStoryEncounterUnlocked,type StoryEncounterId } from '../story/story-content';
import { actionButton,pageHeader,surface,uiText } from './design/components';
import { color,type } from './design/tokens';
import type { ViewContext } from './theme';

export function renderEasyStory(ctx:ViewContext,opts:{save:GameSaveV1;onBack:()=>void;onEncounter:(id:StoryEncounterId)=>void;onNewGame:()=>void}){
  const {root}=ctx,completed=opts.save.story.completedEncounterIds;
  pageHeader(root,ctx.locale,ctx.locale==='en'?'Main Story':'主線模式',opts.onBack);
  uiText(root,ctx.locale,ctx.locale==='en'?'CHAPTER 1 · EASY':'第一章 · EASY',24,72,type.caption,color.gold,'700');
  uiText(root,ctx.locale,ctx.locale==='en'?'Learn the rules before the board learns you.':'先理解棋局，再面對真正的對手。',24,96,13,color.inkSoft);

  EASY_STORY_ENCOUNTERS.forEach((encounter,index)=>{
    const y=132+index*86,done=completed.includes(encounter.id),unlocked=isStoryEncounterUnlocked(encounter.id,completed),active=unlocked&&!done;
    surface(root,24,y,342,72,active);
    const badge=encounter.boss?'BOSS':encounter.id;
    uiText(root,ctx.locale,badge,38,y+12,9,encounter.boss?color.danger:color.gold,'700');
    uiText(root,ctx.locale,encounter.title,38,y+29,14,unlocked?color.ink:color.muted,'700');
    uiText(root,ctx.locale,done?'✓':unlocked?'›':'LOCK',326,y+23,13,done?color.violet:unlocked?color.gold:color.muted,'700');
    if(unlocked){const hit=new Graphics().rect(24,y,342,72).fill({color:color.paper,alpha:.001});hit.eventMode='static';hit.cursor='pointer';hit.on('pointertap',()=>opts.onEncounter(encounter.id));root.addChild(hit);}
  });

  uiText(root,ctx.locale,ctx.locale==='en'?`${completed.length} / ${EASY_STORY_ENCOUNTERS.length} cleared`:`已完成 ${completed.length} / ${EASY_STORY_ENCOUNTERS.length}`,24,662,11,color.inkSoft);
  actionButton(root,ctx.locale,24,694,342,42,ctx.locale==='en'?'NEW STORY SAVE':'重新開始主線',opts.onNewGame,false);
}
