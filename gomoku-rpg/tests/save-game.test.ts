import { describe,expect,it } from 'vitest';
import { completeStoryEncounter,createNewGameSave,normalizeGameSave } from '../src/save-game';

describe('IndexedDB save-game model',()=>{
  it('starts with Vanguard and no story progress',()=>{const save=createNewGameSave('2026-08-21T00:00:00Z');expect(save.progression.unlockedHeroes).toEqual(['vanguard']);expect(save.story.completedEncounterIds).toEqual([]);expect(save.progression.soul).toBe(0);});
  it('records completed story encounters without duplication',()=>{let save=createNewGameSave();save=completeStoryEncounter(save,'E1-1');save=completeStoryEncounter(save,'E1-1');expect(save.story.completedEncounterIds).toEqual(['E1-1']);expect(save.story.lastEncounterId).toBe('E1-1');});
  it('marks Easy chapter complete only after the boss',()=>{let save=createNewGameSave();save=completeStoryEncounter(save,'E1-5');expect(save.story.easyBossCleared).toBe(false);save=completeStoryEncounter(save,'E1-BOSS');expect(save.story.easyBossCleared).toBe(true);});
  it('normalizes malformed data and preserves Vanguard ownership',()=>{const save=normalizeGameSave({version:1,slot:'autosave',story:{completedEncounterIds:['E1-1','bad'],lastEncounterId:'bad',easyBossCleared:false},progression:{unlockedHeroes:['shade'],soul:-10,skillFragments:2,roguelikeUnlocked:false}});expect(save.story.completedEncounterIds).toEqual(['E1-1']);expect(save.progression.unlockedHeroes).toContain('vanguard');expect(save.progression.soul).toBe(0);});
});
