import { describe,expect,it } from 'vitest';
import { EASY_KNOWLEDGE_BOUNDARY,easyAllows,easyPatternAttention } from '../src/runtime/easy-knowledge-boundary';

describe('M7.4 Easy knowledge boundary',()=>{
  it('keeps tactical guardrails but excludes advanced planning',()=>{
    expect(easyAllows('immediate-win')).toBe(true);
    expect(easyAllows('forced-block')).toBe(true);
    expect(easyAllows('lookahead-search')).toBe(false);
    expect(easyAllows('fork-planning')).toBe(false);
    expect(easyAllows('resource-planning')).toBe(false);
    expect(EASY_KNOWLEDGE_BOUNDARY.searchDepth).toBe(0);
  });

  it('pays progressively less attention to subtle beginner patterns',()=>{
    expect(easyPatternAttention('five')).toBe(1);
    expect(easyPatternAttention('open-four')).toBeGreaterThan(easyPatternAttention('open-three'));
    expect(easyPatternAttention('open-three')).toBeGreaterThan(easyPatternAttention('open-two'));
    expect(easyPatternAttention('open-two')).toBeGreaterThan(easyPatternAttention('two'));
  });
});
