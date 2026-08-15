import type { HeroId } from './heroes';
import type { SkillId } from './skills';

export type MatchOutcome='playing'|'victory'|'defeat'|'draw';
export interface PlaytestMetrics {
  hero:HeroId;
  startedAt:number;
  endedAt:number|null;
  outcome:MatchOutcome;
  playerTurns:number;
  placements:number;
  patternMana:number;
  passiveMana:number;
  manaSpent:number;
  passiveTriggers:number;
  skillUses:Record<SkillId,number>;
  peakMana:number;
  endingMana:number;
}

export function createPlaytestMetrics(hero:HeroId,startingMana=0):PlaytestMetrics{return {hero,startedAt:Date.now(),endedAt:null,outcome:'playing',playerTurns:0,placements:0,patternMana:0,passiveMana:0,manaSpent:0,passiveTriggers:0,skillUses:{blink:0,guard:0,seal:0},peakMana:startingMana,endingMana:startingMana};}
export function recordMana(metrics:PlaytestMetrics,mana:number){metrics.peakMana=Math.max(metrics.peakMana,mana);metrics.endingMana=mana;}
export function recordPlacement(metrics:PlaytestMetrics,patternMana:number,passiveTriggered:boolean,passiveMana:number,mana:number){metrics.playerTurns++;metrics.placements++;metrics.patternMana+=patternMana;metrics.passiveMana+=passiveMana;if(passiveTriggered)metrics.passiveTriggers++;recordMana(metrics,mana);}
export function recordSkill(metrics:PlaytestMetrics,skill:SkillId,cost:number,passiveTriggered:boolean,passiveMana:number,mana:number){metrics.playerTurns++;metrics.skillUses[skill]++;metrics.manaSpent+=cost;metrics.passiveMana+=passiveMana;if(passiveTriggered)metrics.passiveTriggers++;recordMana(metrics,mana);}
export function finishMetrics(metrics:PlaytestMetrics,outcome:Exclude<MatchOutcome,'playing'>,mana:number){metrics.outcome=outcome;metrics.endedAt=Date.now();recordMana(metrics,mana);}
export function summarizeMetrics(metrics:PlaytestMetrics){const durationSeconds=Math.round(((metrics.endedAt??Date.now())-metrics.startedAt)/1000);const skillUsesTotal=Object.values(metrics.skillUses).reduce((sum,value)=>sum+value,0);return {version:1,hero:metrics.hero,outcome:metrics.outcome,durationSeconds,playerTurns:metrics.playerTurns,placements:metrics.placements,skillUsesTotal,skillUses:metrics.skillUses,patternMana:metrics.patternMana,passiveMana:metrics.passiveMana,manaSpent:metrics.manaSpent,passiveTriggers:metrics.passiveTriggers,passiveTriggerRate:metrics.playerTurns?Number((metrics.passiveTriggers/metrics.playerTurns).toFixed(3)):0,peakMana:metrics.peakMana,endingMana:metrics.endingMana};}
export function summaryText(metrics:PlaytestMetrics){return JSON.stringify(summarizeMetrics(metrics),null,2);}
