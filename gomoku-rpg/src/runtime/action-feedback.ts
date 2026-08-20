import { Player, Pos } from '../game';
import { HeroId } from '../heroes';
import { SkillId } from '../skills';
import type { CpuDecisionCandidate } from './cpu-action-evaluator';

export type ActionActor='player'|'cpu';
export interface CpuDecisionTrace{cpuLevel:number;selectedScore:number|null;bestScore:number|null;regret:number|null;reason:string|null;topCandidates:CpuDecisionCandidate[];manaBefore:number;}
export interface ActionFeedback{actor:ActionActor;player:Player;heroId:HeroId;kind:'place'|'skill';at:Pos;source?:Pos;skillId?:SkillId;decision?:CpuDecisionTrace;}
export interface ActionHistoryEntry extends ActionFeedback{sequence:number;}

export function appendActionHistory(history:readonly ActionHistoryEntry[],feedback:ActionFeedback,limit=3):ActionHistoryEntry[]{
 const sequence=(history.at(-1)?.sequence??0)+1;
 return [...history,{...feedback,sequence}].slice(-limit);
}
