import { HeroId,HeroLoadout } from '../heroes';
import { ViewContext } from './theme';
import { renderBattleSetupVisual } from './battle-setup-visual';

export function renderCpuMatchSetup(ctx:ViewContext,opts:{
  playerHeroId:HeroId;
  playerLoadout:HeroLoadout;
  cpuHeroId:HeroId;
  randomOpponent:boolean;
  onBack:()=>void;
  onCpuHero:(id:HeroId)=>void;
  onRandom:()=>void;
  onContinue:()=>void;
}){
  renderBattleSetupVisual(ctx.root,ctx.locale,opts);
}
