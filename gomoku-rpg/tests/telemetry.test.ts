import { describe,expect,it,vi } from 'vitest';
import { createPlaytestMetrics,finishMetrics,recordPlacement,recordSkill,summarizeMetrics } from '../src/telemetry';

describe('M2.4 playtest telemetry',()=>{
  it('summarizes mana economy, skills, passive triggers and outcome',()=>{
    vi.spyOn(Date,'now').mockReturnValueOnce(1000);
    const metrics=createPlaytestMetrics('arcanist',0);
    recordPlacement(metrics,1,false,0,1);
    recordSkill(metrics,'seal',2,true,1,0);
    recordPlacement(metrics,2,false,0,2);
    vi.spyOn(Date,'now').mockReturnValueOnce(61000);
    finishMetrics(metrics,'victory',2);
    const summary=summarizeMetrics(metrics);
    expect(summary).toMatchObject({hero:'arcanist',outcome:'victory',durationSeconds:60,playerTurns:3,placements:2,skillUsesTotal:1,skillUses:{blink:0,guard:0,seal:1},patternMana:3,passiveMana:1,manaSpent:2,passiveTriggers:1,peakMana:2,endingMana:2});
    expect(summary.passiveTriggerRate).toBeCloseTo(1/3,3);
    vi.restoreAllMocks();
  });

  it('keeps hero-specific sessions isolated',()=>{
    const vanguard=createPlaytestMetrics('vanguard');
    const shade=createPlaytestMetrics('shade');
    recordPlacement(vanguard,1,true,0,1);
    recordPlacement(shade,0,true,1,1);
    expect(summarizeMetrics(vanguard)).toMatchObject({hero:'vanguard',patternMana:1,passiveMana:0,passiveTriggers:1});
    expect(summarizeMetrics(shade)).toMatchObject({hero:'shade',patternMana:0,passiveMana:1,passiveTriggers:1});
  });
});
