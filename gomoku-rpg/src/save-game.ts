import type { HeroId } from './heroes';
import type { StoryEncounterId } from './story/story-content';

export const SAVE_DB_NAME='gomoku-rpg';
export const SAVE_DB_VERSION=1;
export const SAVE_STORE='save-slots';
export const AUTOSAVE_SLOT='autosave';

export interface StoryProgress{
  completedEncounterIds:StoryEncounterId[];
  lastEncounterId:StoryEncounterId|null;
  easyBossCleared:boolean;
}
export interface PlayerProgression{
  unlockedHeroes:HeroId[];
  soul:number;
  skillFragments:number;
  roguelikeUnlocked:boolean;
}
export interface GameSaveV1{
  version:1;
  slot:string;
  createdAt:string;
  updatedAt:string;
  story:StoryProgress;
  progression:PlayerProgression;
}

export function createNewGameSave(now=new Date().toISOString()):GameSaveV1{
  return {version:1,slot:AUTOSAVE_SLOT,createdAt:now,updatedAt:now,story:{completedEncounterIds:[],lastEncounterId:null,easyBossCleared:false},progression:{unlockedHeroes:['vanguard'],soul:0,skillFragments:0,roguelikeUnlocked:false}};
}

export function normalizeGameSave(value:unknown):GameSaveV1{
  if(!value||typeof value!=='object')return createNewGameSave();
  const source=value as Partial<GameSaveV1>,fallback=createNewGameSave(),story=source.story??fallback.story,progression=source.progression??fallback.progression;
  const completed:StoryEncounterId[]=Array.isArray(story.completedEncounterIds)?story.completedEncounterIds.filter((id):id is StoryEncounterId=>['E1-1','E1-2','E1-3','E1-4','E1-5','E1-BOSS'].includes(String(id))):[];
  const heroes:HeroId[]=Array.isArray(progression.unlockedHeroes)?progression.unlockedHeroes.filter((id):id is HeroId=>['vanguard','arcanist','shade','architect'].includes(String(id))):['vanguard'];
  if(!heroes.includes('vanguard'))heroes.unshift('vanguard');
  return {version:1,slot:AUTOSAVE_SLOT,createdAt:typeof source.createdAt==='string'?source.createdAt:fallback.createdAt,updatedAt:typeof source.updatedAt==='string'?source.updatedAt:fallback.updatedAt,story:{completedEncounterIds:[...new Set(completed)],lastEncounterId:story.lastEncounterId&&completed.includes(story.lastEncounterId)?story.lastEncounterId:null,easyBossCleared:completed.includes('E1-BOSS')||!!story.easyBossCleared},progression:{unlockedHeroes:[...new Set(heroes)],soul:Number.isFinite(progression.soul)?Math.max(0,Number(progression.soul)):0,skillFragments:Number.isFinite(progression.skillFragments)?Math.max(0,Number(progression.skillFragments)):0,roguelikeUnlocked:!!progression.roguelikeUnlocked}};
}

function openDb():Promise<IDBDatabase>{
  return new Promise((resolve,reject)=>{
    if(typeof indexedDB==='undefined'){reject(new Error('IndexedDB unavailable'));return;}
    const request=indexedDB.open(SAVE_DB_NAME,SAVE_DB_VERSION);
    request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(SAVE_STORE))db.createObjectStore(SAVE_STORE,{keyPath:'slot'});};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error??new Error('Unable to open save database'));
  });
}

export async function loadGameSave(slot=AUTOSAVE_SLOT):Promise<GameSaveV1|null>{
  try{const db=await openDb();return await new Promise((resolve,reject)=>{const tx=db.transaction(SAVE_STORE,'readonly'),request=tx.objectStore(SAVE_STORE).get(slot);request.onsuccess=()=>resolve(request.result?normalizeGameSave(request.result):null);request.onerror=()=>reject(request.error);tx.oncomplete=()=>db.close();});}catch{return null;}
}
export async function saveGameSave(save:GameSaveV1):Promise<GameSaveV1>{
  const next=normalizeGameSave({...save,updatedAt:new Date().toISOString()});
  try{const db=await openDb();await new Promise<void>((resolve,reject)=>{const tx=db.transaction(SAVE_STORE,'readwrite');tx.objectStore(SAVE_STORE).put(next);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}catch{}
  return next;
}
export async function deleteGameSave(slot=AUTOSAVE_SLOT):Promise<void>{
  try{const db=await openDb();await new Promise<void>((resolve,reject)=>{const tx=db.transaction(SAVE_STORE,'readwrite');tx.objectStore(SAVE_STORE).delete(slot);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);});}catch{}
}

export function completeStoryEncounter(save:GameSaveV1,encounterId:StoryEncounterId):GameSaveV1{
  const completed=[...save.story.completedEncounterIds];if(!completed.includes(encounterId))completed.push(encounterId);
  return normalizeGameSave({...save,story:{...save.story,completedEncounterIds:completed,lastEncounterId:encounterId,easyBossCleared:completed.includes('E1-BOSS')}});
}
