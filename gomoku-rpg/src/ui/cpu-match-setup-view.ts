import { HeroId,HeroLoadout } from '../heroes';
import { CpuDifficultyId } from '../runtime/cpu-difficulty-tier';
import { ViewContext } from './theme';
import { renderBattleSetupVisual } from './battle-setup-visual';

export function renderCpuMatchSetup(ctx:ViewContext,opts:{
  playerHeroId:HeroId;
  playerLoadout:HeroLoadout;
  cpuHeroId:HeroId;
  cpuDifficulty:CpuDifficultyId;
  randomOpponent:boolean;
  onBack:()=>void;
  onCpuHero:(id:HeroId)=>void;
  onCpuDifficulty:(difficulty:CpuDifficultyId)=>void;
  onRandom:()=>void;
  onContinue:()=>void;
}){
  renderBattleSetupVisual(ctx.root,ctx.locale,opts);
}
