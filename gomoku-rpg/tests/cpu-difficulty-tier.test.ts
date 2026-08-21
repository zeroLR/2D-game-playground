import { describe,expect,it } from 'vitest';
import { CPU_DIFFICULTIES,CPU_DIFFICULTY_TIERS,closestDifficultyForProfileLevel,cpuProfileLevelForDifficulty } from '../src/runtime/cpu-difficulty-tier';

describe('M7.3-R difficulty tier foundation',()=>{
  it('defines exactly six canonical player-facing tiers',()=>{expect(CPU_DIFFICULTIES).toEqual(['easy','normal','hard','extreme','manic','chaos']);expect(CPU_DIFFICULTY_TIERS).toHaveLength(6);});
  it('maps tiers to strictly increasing hidden profiles without changing the previous baseline strengths',()=>{const levels=CPU_DIFFICULTIES.map(cpuProfileLevelForDifficulty);expect(levels).toEqual([1,3,5,7,10,20]);for(let i=1;i<levels.length;i++)expect(levels[i]).toBeGreaterThan(levels[i-1]);});
  it('aligns capability milestones with the product contract',()=>{expect(CPU_DIFFICULTY_TIERS.find(t=>t.id==='easy')?.capabilities).toContain('immediate-tactics');expect(CPU_DIFFICULTY_TIERS.find(t=>t.id==='normal')?.capabilities).toContain('pattern-recognition');expect(CPU_DIFFICULTY_TIERS.find(t=>t.id==='hard')?.capabilities).toContain('threat-planning');expect(CPU_DIFFICULTY_TIERS.find(t=>t.id==='extreme')?.capabilities).toContain('skill-aware-search');expect(CPU_DIFFICULTY_TIERS.find(t=>t.id==='manic')?.capabilities).toContain('strategic-evaluation');expect(CPU_DIFFICULTY_TIERS.find(t=>t.id==='chaos')?.capabilities).toContain('deep-selective-search');});
  it('maps legacy numeric records to the closest named tier',()=>{expect(closestDifficultyForProfileLevel(3)).toBe('normal');expect(closestDifficultyForProfileLevel(6)).toBe('hard');expect(closestDifficultyForProfileLevel(18)).toBe('chaos');expect(closestDifficultyForProfileLevel(100)).toBe('chaos');});
});
