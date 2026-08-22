import { HeroId, createLoadout } from './heroes';
import { SkillId } from './skills';
import { ActionHistoryEntry } from './runtime/action-feedback';
import { CpuDifficultyId,isCpuDifficultyId,closestDifficultyForProfileLevel } from './runtime/cpu-difficulty-tier';
import { PlaytestMetrics } from './telemetry';

export type MatchResult='victory'|'defeat'|'draw';
export interface MatchRecord{
 id:string;
 startedAt:string;
 finishedAt:string;
 heroId:HeroId;
 cpuHeroId:HeroId;
 playerSkillIds:readonly [SkillId,SkillId];
 cpuSkillIds:readonly [SkillId,SkillId];
 cpuDifficulty?:CpuDifficultyId;
 cpuProfileLevel?:number;
 /** @deprecated legacy player-facing field from pre-tier exports. */
 cpuLevel?:number;
 result:MatchResult;
 turns:number;
 actions:ActionHistoryEntry[];
 metrics:PlaytestMetrics;
}

const STORAGE_KEY='gomoku-rpg.match-records.v1';
const MAX_RECORDS=100;

export function loadMatchRecords():MatchRecord[]{
 try{
  const raw=localStorage.getItem(STORAGE_KEY);
  if(!raw)return [];
  const value:unknown=JSON.parse(raw);
  if(!Array.isArray(value))return [];
  return value.filter(isMatchRecord).map(normalizeMatchRecord).slice(0,MAX_RECORDS);
 }catch{return [];}
}

export function saveMatchRecord(record:MatchRecord):MatchRecord[]{
 const normalized=normalizeMatchRecord(record),records=[normalized,...loadMatchRecords().filter(item=>item.id!==record.id)].slice(0,MAX_RECORDS);
 localStorage.setItem(STORAGE_KEY,JSON.stringify(records));
 return records;
}

export function clearMatchRecords(){localStorage.removeItem(STORAGE_KEY);}
export function deleteMatchRecords(ids:readonly string[]):MatchRecord[]{
 const removed=new Set(ids),records=loadMatchRecords().filter(record=>!removed.has(record.id));
 localStorage.setItem(STORAGE_KEY,JSON.stringify(records));
 return records;
}

export function createMatchRecord(input:Omit<MatchRecord,'id'|'finishedAt'|'playerSkillIds'|'cpuSkillIds'> & Partial<Pick<MatchRecord,'playerSkillIds'|'cpuSkillIds'>>):MatchRecord{
 const finishedAt=new Date().toISOString();
 return normalizeMatchRecord({...input,id:`${finishedAt}-${Math.random().toString(36).slice(2,8)}`,finishedAt} as MatchRecord);
}

function actionLoadout(actions:readonly ActionHistoryEntry[],actor:'player'|'cpu'):[SkillId,SkillId]|null{
 const ids=actions.find((action)=>action.actor===actor&&action.equippedSkillIds)?.equippedSkillIds;
 return ids?[...ids] as [SkillId,SkillId]:null;
}
function normalizeMatchRecord(record:MatchRecord):MatchRecord{
 const playerSkillIds=record.playerSkillIds??actionLoadout(record.actions,'player')??createLoadout(record.heroId).skillIds;
 const cpuSkillIds=record.cpuSkillIds??actionLoadout(record.actions,'cpu')??createLoadout(record.cpuHeroId).skillIds;
 const normalized={...record,playerSkillIds:[...playerSkillIds] as [SkillId,SkillId],cpuSkillIds:[...cpuSkillIds] as [SkillId,SkillId]};
 if(normalized.cpuDifficulty)return normalized;
 const legacyLevel=normalized.cpuProfileLevel??normalized.cpuLevel;
 if(typeof legacyLevel!=='number')return normalized;
 return {...normalized,cpuDifficulty:closestDifficultyForProfileLevel(legacyLevel),cpuProfileLevel:legacyLevel};
}

function isMatchRecord(value:unknown):value is MatchRecord{
 if(!value||typeof value!=='object')return false;
 const record=value as Partial<MatchRecord>;
 return typeof record.id==='string'&&typeof record.startedAt==='string'&&typeof record.finishedAt==='string'&&typeof record.heroId==='string'&&typeof record.cpuHeroId==='string'&&(record.playerSkillIds===undefined||Array.isArray(record.playerSkillIds))&&(record.cpuSkillIds===undefined||Array.isArray(record.cpuSkillIds))&&(record.cpuDifficulty===undefined||isCpuDifficultyId(record.cpuDifficulty))&&(record.cpuProfileLevel===undefined||typeof record.cpuProfileLevel==='number')&&(record.cpuLevel===undefined||typeof record.cpuLevel==='number')&&(record.result==='victory'||record.result==='defeat'||record.result==='draw')&&typeof record.turns==='number'&&Array.isArray(record.actions)&&!!record.metrics;
}
