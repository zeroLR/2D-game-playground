import { Player, Pos } from '../game';
import { HeroId } from '../heroes';
import { SkillId } from '../skills';
import type { CpuDecisionCandidate } from './cpu-action-evaluator';
import type { CpuDifficultyId } from './cpu-difficulty-tier';

export type ActionActor='player'|'cpu';
export interface CpuDecisionTrace{
  cpuDifficulty?:CpuDifficultyId;
  profileLevel?:number;
  /** @deprecated retained for match-export backward compatibility. */
  cpuLevel?:number;
  selectedScore:number|null;
  bestScore:number|null;
  regret:number|null;
  reason:string|null;
  topCandidates:CpuDecisionCandidate[];
  manaBefore:number;
}
export interface ActionFeedback{actor:ActionActor;player:Player;heroId:HeroId;kind:'place'|'skill';at:Pos;source?:Pos;skillId?:SkillId;equippedSkillIds?:readonly [SkillId,SkillId];decision?:CpuDecisionTrace;}
export interface ActionHistoryEntry extends ActionFeedback{sequence:number;}

export function appendActionHistory(history:readonly ActionHistoryEntry[],feedback:ActionFeedback,limit=3):ActionHistoryEntry[]{
 const sequence=(history.at(-1)?.sequence??0)+1;
 return [...history,{...feedback,equippedSkillIds:feedback.equippedSkillIds?[...feedback.equippedSkillIds] as [SkillId,SkillId]:undefined,sequence}].slice(-limit);
}
