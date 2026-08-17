import { Player, Pos } from '../game';
import { HeroId } from '../heroes';
import { SkillId } from '../skills';

export type ActionActor='player'|'cpu';
export interface ActionFeedback{actor:ActionActor;player:Player;heroId:HeroId;kind:'place'|'skill';at:Pos;source?:Pos;skillId?:SkillId;}
export interface ActionHistoryEntry extends ActionFeedback{sequence:number;}

export function appendActionHistory(history:readonly ActionHistoryEntry[],feedback:ActionFeedback,limit=200):ActionHistoryEntry[]{
 const sequence=(history.at(-1)?.sequence??0)+1;
 return [...history,{...feedback,sequence}].slice(-limit);
}
