import { describe,expect,it } from 'vitest';
import { EASY_STORY_TEACHING_CONTRACT,assessEasyTeachingMetrics } from '../src/story/easy-teaching-contract';
import { createPlaytestMetrics } from '../src/telemetry';

describe('M7.4 Easy story teaching contract',()=>{
  it('defines a six-encounter teaching progression ending in a Normal preview boss',()=>{
    expect(EASY_STORY_TEACHING_CONTRACT.map(x=>x.id)).toEqual(['E1-1','E1-2','E1-3','E1-4','E1-5','E1-BOSS']);
    expect(EASY_STORY_TEACHING_CONTRACT.at(-1)?.cpuDifficulty).toBe('normal');
  });

  it('introduces skills only after rules, patterns and Mana',()=>{
    const ids=(concept:string)=>EASY_STORY_TEACHING_CONTRACT.findIndex(x=>x.concepts.includes(concept as never));
    expect(ids('five-in-row')).toBeLessThan(ids('mana-generation'));
    expect(ids('mana-generation')).toBeLessThan(ids('blink'));
    expect(ids('blink')).toBeLessThan(ids('charge'));
  });

  it('flags a victory that ignores many skill opportunities',()=>{
    const metrics=createPlaytestMetrics('vanguard');
    metrics.outcome='victory';
    metrics.skillOpportunities.blink=8;
    metrics.skillOpportunities.charge=8;
    metrics.manaWasted=10;
    metrics.manaCappedTurns=6;
    const assessment=assessEasyTeachingMetrics(metrics);
    expect(assessment.skillIgnoranceSuccess).toBe(true);
    expect(assessment.manaNeglect).toBe(true);
    expect(assessment.readyForBoss).toBe(false);
  });

  it('accepts a clean Vanguard win with starter skill usage as boss-ready evidence',()=>{
    const metrics=createPlaytestMetrics('vanguard');
    metrics.outcome='victory';
    metrics.skillOpportunities.charge=3;
    metrics.skillUses.charge=1;
    metrics.manaWasted=1;
    metrics.manaCappedTurns=1;
    expect(assessEasyTeachingMetrics(metrics).readyForBoss).toBe(true);
  });
});
