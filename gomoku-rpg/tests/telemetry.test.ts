import { describe,expect,it,vi } from 'vitest';
import { createPlaytestMetrics,finishMetrics,recordManaWaste,recordPlacement,recordSkill,recordSkillOpportunities,recordTurnStart,summarizeMetrics } from '../src/telemetry';

describe('M2.4 playtest telemetry',()=>{
 it('summarizes mana economy, skills, passive triggers and outcome',()=>{
  vi.spyOn(Date,'now').mockReturnValueOnce(1000);const metrics=createPlaytestMetrics('arcanist',0);
  recordPlacement(metrics,1,false,0,1);recordSkillOpportunities(metrics,['blink','phase']);recordSkill(metrics,'phase',2,true,1,1,2);recordPlacement(metrics,2,false,0,3);
  vi.spyOn(Date,'now').mockReturnValueOnce(61000);finishMetrics(metrics,'victory',3);const summary=summarizeMetrics(metrics);
  expect(summary).toMatchObject({version:3,hero:'arcanist',outcome:'victory',durationSeconds:60,playerTurns:3,placements:2,skillUsesTotal:1,skillOpportunitiesTotal:2,skillUseRate:0.5,patternMana:3,passiveMana:1,manaSpent:2,manaWasted:0,manaCappedTurns:0,unusedManaAtEnd:3,passiveTriggers:1,peakMana:3,endingMana:3});
  expect(summary.skillUses.phase).toBe(1);expect(summary.skillOpportunities).toMatchObject({blink:1,phase:1});expect(summary.skillStats.phase).toEqual({uses:1,opportunities:1,useRate:1,averageManaAtUse:2});expect(summary.skillStats.blink.useRate).toBe(0);expect(summary.averageManaAtSkillUse.phase).toBe(2);expect(summary.passiveTriggerRate).toBeCloseTo(1/3,3);vi.restoreAllMocks();
 });
 it('tracks capped turns and mana lost to the cap',()=>{const metrics=createPlaytestMetrics('shade',5);recordTurnStart(metrics,5);recordTurnStart(metrics,4);recordManaWaste(metrics,2,4,5);recordPlacement(metrics,1,true,1,5);const summary=summarizeMetrics(metrics);expect(summary.manaCappedTurns).toBe(1);expect(summary.manaCappedTurnRate).toBe(1);expect(summary.manaWasted).toBe(1);});
 it('keeps hero-specific sessions isolated',()=>{const vanguard=createPlaytestMetrics('vanguard');const shade=createPlaytestMetrics('shade');recordPlacement(vanguard,1,true,0,1);recordPlacement(shade,0,true,1,1);expect(summarizeMetrics(vanguard)).toMatchObject({hero:'vanguard',patternMana:1,passiveMana:0,passiveTriggers:1});expect(summarizeMetrics(shade)).toMatchObject({hero:'shade',patternMana:0,passiveMana:1,passiveTriggers:1});});
 it('reports zero use rate when no skill was affordable and legal',()=>{const metrics=createPlaytestMetrics('vanguard');recordPlacement(metrics,0,false,0,0);expect(summarizeMetrics(metrics)).toMatchObject({skillOpportunitiesTotal:0,skillUsesTotal:0,skillUseRate:0});});
});
