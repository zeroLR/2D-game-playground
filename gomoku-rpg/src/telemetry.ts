import type { HeroId } from './heroes';
import type { SkillId } from './skills';

export type MatchOutcome='playing'|'victory'|'defeat'|'draw';
export interface PlaytestMetrics {hero:HeroId;startedAt:number;endedAt:number|null;outcome:MatchOutcome;playerTurns:number;placements:number;patternMana:number;passiveMana:number;manaSpent:number;passiveTriggers:number;skillUses:Record<SkillId,number>;peakMana:number;endingMana:number;}
export type MatchSummary=ReturnType<typeof summarizeMetrics>;
export const HISTORY_STORAGE_KEY='gomoku-rpg.playtest-history.v1';

export function createPlaytestMetrics(hero:HeroId,startingMana=0):PlaytestMetrics{return {hero,startedAt:Date.now(),endedAt:null,outcome:'playing',playerTurns:0,placements:0,patternMana:0,passiveMana:0,manaSpent:0,passiveTriggers:0,skillUses:{blink:0,guard:0,seal:0},peakMana:startingMana,endingMana:startingMana};}
export function recordMana(metrics:PlaytestMetrics,mana:number){metrics.peakMana=Math.max(metrics.peakMana,mana);metrics.endingMana=mana;}
export function recordPlacement(metrics:PlaytestMetrics,patternMana:number,passiveTriggered:boolean,passiveMana:number,mana:number){metrics.playerTurns++;metrics.placements++;metrics.patternMana+=patternMana;metrics.passiveMana+=passiveMana;if(passiveTriggered)metrics.passiveTriggers++;recordMana(metrics,mana);}
export function recordSkill(metrics:PlaytestMetrics,skill:SkillId,cost:number,passiveTriggered:boolean,passiveMana:number,mana:number){metrics.playerTurns++;metrics.skillUses[skill]++;metrics.manaSpent+=cost;metrics.passiveMana+=passiveMana;if(passiveTriggered)metrics.passiveTriggers++;recordMana(metrics,mana);}
export function finishMetrics(metrics:PlaytestMetrics,outcome:Exclude<MatchOutcome,'playing'>,mana:number){metrics.outcome=outcome;metrics.endedAt=Date.now();recordMana(metrics,mana);}
export function summarizeMetrics(metrics:PlaytestMetrics){const durationSeconds=Math.round(((metrics.endedAt??Date.now())-metrics.startedAt)/1000);const skillUsesTotal=Object.values(metrics.skillUses).reduce((sum,value)=>sum+value,0);return {version:1,hero:metrics.hero,outcome:metrics.outcome,durationSeconds,playerTurns:metrics.playerTurns,placements:metrics.placements,skillUsesTotal,skillUses:metrics.skillUses,patternMana:metrics.patternMana,passiveMana:metrics.passiveMana,manaSpent:metrics.manaSpent,passiveTriggers:metrics.passiveTriggers,passiveTriggerRate:metrics.playerTurns?Number((metrics.passiveTriggers/metrics.playerTurns).toFixed(3)):0,peakMana:metrics.peakMana,endingMana:metrics.endingMana};}
export function summaryText(metrics:PlaytestMetrics){return JSON.stringify(summarizeMetrics(metrics),null,2);}
export function loadHistory():MatchSummary[]{try{const raw=localStorage.getItem(HISTORY_STORAGE_KEY);if(!raw)return [];const value=JSON.parse(raw);return Array.isArray(value)?value:[];}catch{return [];}}
export function saveCompletedMatch(metrics:PlaytestMetrics){if(metrics.outcome==='playing')return loadHistory();const history=loadHistory();history.push(summarizeMetrics(metrics));try{localStorage.setItem(HISTORY_STORAGE_KEY,JSON.stringify(history));}catch{/* storage is optional */}return history;}
export function clearHistory(){try{localStorage.removeItem(HISTORY_STORAGE_KEY);}catch{/* storage is optional */}}
export function exportHistory(){const matches=loadHistory();const heroCounts:Record<HeroId,number>={vanguard:0,arcanist:0,shade:0};matches.forEach((match)=>heroCounts[match.hero]++);return {version:1,exportedAt:new Date().toISOString(),totalMatches:matches.length,heroCounts,matches};}
export function historyText(){return JSON.stringify(exportHistory(),null,2);}
