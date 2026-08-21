import { describe,expect,it } from 'vitest';
import { EASY_STORY_ENCOUNTERS,isStoryEncounterUnlocked,nextStoryEncounterId } from '../src/story/story-content';

describe('Easy story teaching progression',()=>{
  it('defines five teaching encounters plus a Normal-preview boss',()=>{
    expect(EASY_STORY_ENCOUNTERS.map(x=>x.id)).toEqual(['E1-1','E1-2','E1-3','E1-4','E1-5','E1-BOSS']);
    expect(EASY_STORY_ENCOUNTERS.slice(0,5).every(x=>x.cpuDifficulty==='easy')).toBe(true);
    expect(EASY_STORY_ENCOUNTERS.at(-1)).toMatchObject({id:'E1-BOSS',cpuDifficulty:'normal',boss:true});
  });
  it('unlocks encounters sequentially',()=>{
    expect(isStoryEncounterUnlocked('E1-1',[])).toBe(true);
    expect(isStoryEncounterUnlocked('E1-2',[])).toBe(false);
    expect(isStoryEncounterUnlocked('E1-2',['E1-1'])).toBe(true);
    expect(nextStoryEncounterId(['E1-1','E1-2'])).toBe('E1-3');
    expect(nextStoryEncounterId(EASY_STORY_ENCOUNTERS.map(x=>x.id))).toBeNull();
  });
  it('teaches Mana and both starter skills before the boss',()=>{
    const concepts=EASY_STORY_ENCOUNTERS.flatMap(x=>x.concepts);
    expect(concepts).toContain('pattern-mana');
    expect(concepts).toContain('blink');
    expect(concepts).toContain('charge');
  });
});
