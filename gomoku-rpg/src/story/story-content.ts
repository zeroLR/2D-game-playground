import type { HeroId } from '../heroes';
import type { CpuDifficultyId } from '../runtime/cpu-difficulty-tier';

export type StoryChapterId='easy';
export type StoryEncounterId='E1-1'|'E1-2'|'E1-3'|'E1-4'|'E1-5'|'E1-BOSS';
export type TeachingConcept='legal-placement'|'five-in-row'|'open-two'|'open-three'|'basic-block'|'pattern-mana'|'vanguard-passive'|'blink'|'charge'|'chapter-mastery';

export interface StoryEncounterDefinition{
  id:StoryEncounterId;
  chapter:StoryChapterId;
  order:number;
  title:string;
  subtitle:string;
  playerHeroId:HeroId;
  cpuHeroId:HeroId;
  cpuDifficulty:CpuDifficultyId;
  concepts:readonly TeachingConcept[];
  boss?:boolean;
}

export const EASY_STORY_ENCOUNTERS:readonly StoryEncounterDefinition[]=[
  {id:'E1-1',chapter:'easy',order:1,title:'第一手',subtitle:'學會合法落子與五連勝利。',playerHeroId:'vanguard',cpuHeroId:'vanguard',cpuDifficulty:'easy',concepts:['legal-placement','five-in-row']},
  {id:'E1-2',chapter:'easy',order:2,title:'形成威脅',subtitle:'認識活二、活三，以及最基本的阻擋。',playerHeroId:'vanguard',cpuHeroId:'vanguard',cpuDifficulty:'easy',concepts:['open-two','open-three','basic-block']},
  {id:'E1-3',chapter:'easy',order:3,title:'棋型化為 Mana',subtitle:'理解棋型如何產生 Mana，並認識 Vanguard 的節奏。',playerHeroId:'vanguard',cpuHeroId:'vanguard',cpuDifficulty:'easy',concepts:['pattern-mana','vanguard-passive']},
  {id:'E1-4',chapter:'easy',order:4,title:'Blink',subtitle:'第一次使用 Blink 改變棋盤選擇。',playerHeroId:'vanguard',cpuHeroId:'vanguard',cpuDifficulty:'easy',concepts:['blink']},
  {id:'E1-5',chapter:'easy',order:5,title:'Charge',subtitle:'用 Charge 改變棋型，而不是只靠普通落子。',playerHeroId:'vanguard',cpuHeroId:'vanguard',cpuDifficulty:'easy',concepts:['charge']},
  {id:'E1-BOSS',chapter:'easy',order:6,title:'第一章試煉',subtitle:'整合棋型、Mana 與技能；Boss 使用 Normal AI 作為下一章預覽。',playerHeroId:'vanguard',cpuHeroId:'vanguard',cpuDifficulty:'normal',concepts:['chapter-mastery'],boss:true},
];

export function storyEncounter(id:StoryEncounterId){return EASY_STORY_ENCOUNTERS.find(encounter=>encounter.id===id);}
export function nextStoryEncounterId(completed:readonly StoryEncounterId[]):StoryEncounterId|null{
  return EASY_STORY_ENCOUNTERS.find(encounter=>!completed.includes(encounter.id))?.id??null;
}
export function isStoryEncounterUnlocked(id:StoryEncounterId,completed:readonly StoryEncounterId[]){
  const encounter=storyEncounter(id);if(!encounter)return false;if(encounter.order===1)return true;
  const previous=EASY_STORY_ENCOUNTERS.find(item=>item.order===encounter.order-1);return !!previous&&completed.includes(previous.id);
}
