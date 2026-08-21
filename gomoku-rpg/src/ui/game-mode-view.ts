import { Graphics } from 'pixi.js';
import { actionButton,pageHeader,surface,uiText } from './design/components';
import { color,type } from './design/tokens';
import type { ViewContext } from './theme';

export type ProductMode='story'|'free-battle'|'roguelike';

export function renderGameModeHub(ctx:ViewContext,opts:{hasSave:boolean;roguelikeUnlocked:boolean;onBack:()=>void;onMode:(mode:ProductMode)=>void}){
  const {root}=ctx;pageHeader(root,ctx.locale,ctx.locale==='en'?'Play':'遊玩',opts.onBack);
  uiText(root,ctx.locale,ctx.locale==='en'?'CHOOSE A MODE':'選擇模式',24,78,type.caption,color.gold,'700');
  surface(root,24,118,342,142,true);
  uiText(root,ctx.locale,ctx.locale==='en'?'MAIN STORY':'主線模式',42,140,20,color.ink,'700');
  uiText(root,ctx.locale,ctx.locale==='en'?'Learn patterns, Mana and hero skills through six chapters.':'循序學習棋型、Mana 與英雄技能。',42,174,11,color.inkSoft);
  actionButton(root,ctx.locale,42,208,306,38,opts.hasSave?(ctx.locale==='en'?'CONTINUE STORY':'繼續主線'):(ctx.locale==='en'?'START STORY':'開始主線'),()=>opts.onMode('story'),true);

  surface(root,24,278,342,132,true);
  uiText(root,ctx.locale,ctx.locale==='en'?'FREE BATTLE':'自由對戰',42,298,18,color.ink,'700');
  uiText(root,ctx.locale,ctx.locale==='en'?'CPU, local player and future online matches.':'電腦、本機玩家與未來線上對戰。',42,330,11,color.inkSoft);
  actionButton(root,ctx.locale,42,360,306,34,ctx.locale==='en'?'OPEN':'進入',()=>opts.onMode('free-battle'),false);

  surface(root,24,430,342,132,true);
  uiText(root,ctx.locale,ctx.locale==='en'?'ROGUELIKE':'Roguelike',42,450,18,opts.roguelikeUnlocked?color.ink:color.muted,'700');
  uiText(root,ctx.locale,opts.roguelikeUnlocked?(ctx.locale==='en'?'Build a run across escalating routes.':'跨越三段難度路線建立本局 Build。'):(ctx.locale==='en'?'Unlock after the Extreme Boss.':'通關 Extreme Boss 後解鎖。'),42,482,11,color.inkSoft);
  actionButton(root,ctx.locale,42,512,306,34,opts.roguelikeUnlocked?(ctx.locale==='en'?'OPEN':'進入'):(ctx.locale==='en'?'LOCKED':'尚未解鎖'),()=>opts.roguelikeUnlocked&&opts.onMode('roguelike'),false);

  root.addChild(new Graphics().rect(24,594,342,1).fill(color.edge));
  uiText(root,ctx.locale,ctx.locale==='en'?'Progress is autosaved to this device.':'進度會自動保存於此裝置。',24,610,11,color.muted);
}
