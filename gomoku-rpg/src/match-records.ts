import { HeroId } from './heroes';
import { ActionHistoryEntry } from './runtime/action-feedback';
import { PlaytestMetrics } from './telemetry';

export type MatchResult='victory'|'defeat'|'draw';
export interface MatchRecord{
 id:string;
 startedAt:string;
 finishedAt:string;
 heroId:HeroId;
 cpuHeroId:HeroId;
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
  return value.filter(isMatchRecord).slice(0,MAX_RECORDS);
 }catch{return [];}
}

export function saveMatchRecord(record:MatchRecord):MatchRecord[]{
 const records=[record,...loadMatchRecords().filter(item=>item.id!==record.id)].slice(0,MAX_RECORDS);
 localStorage.setItem(STORAGE_KEY,JSON.stringify(records));
 return records;
}

export function clearMatchRecords(){localStorage.removeItem(STORAGE_KEY);}
export function deleteMatchRecords(ids:readonly string[]):MatchRecord[]{
 const removed=new Set(ids),records=loadMatchRecords().filter(record=>!removed.has(record.id));
 localStorage.setItem(STORAGE_KEY,JSON.stringify(records));
 return records;
}

export function createMatchRecord(input:Omit<MatchRecord,'id'|'finishedAt'>):MatchRecord{
 const finishedAt=new Date().toISOString();
 return {...input,id:`${finishedAt}-${Math.random().toString(36).slice(2,8)}`,finishedAt};
}

function isMatchRecord(value:unknown):value is MatchRecord{
 if(!value||typeof value!=='object')return false;
 const record=value as Partial<MatchRecord>;
 return typeof record.id==='string'&&typeof record.startedAt==='string'&&typeof record.finishedAt==='string'&&typeof record.heroId==='string'&&typeof record.cpuHeroId==='string'&&(record.cpuLevel===undefined||typeof record.cpuLevel==='number')&&(record.result==='victory'||record.result==='defeat'||record.result==='draw')&&typeof record.turns==='number'&&Array.isArray(record.actions)&&!!record.metrics;
}
