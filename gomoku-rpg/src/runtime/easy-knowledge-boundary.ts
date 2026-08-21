import type { CpuPatternKind } from './cpu-pattern-recognition';

export type EasyReasoningCapability=
  |'immediate-win'
  |'forced-block'
  |'center-preference'
  |'basic-line-pressure'
  |'compound-threat'
  |'fork-planning'
  |'lookahead-search'
  |'resource-planning'
  |'opponent-modeling';

export interface EasyKnowledgeBoundary{
  allowed:readonly EasyReasoningCapability[];
  excluded:readonly EasyReasoningCapability[];
  patternAttention:Readonly<Record<CpuPatternKind,number>>;
  searchDepth:0;
  teachingIntent:'readable-beginner';
}

/**
 * Easy should behave like an inexperienced but rules-correct opponent.
 * It may see obvious lines, but it must not gain difficulty from fork planning,
 * future search, resource planning or opponent modelling. Immediate wins/blocks
 * remain tactical guardrails so Easy never looks broken.
 */
export const EASY_KNOWLEDGE_BOUNDARY:EasyKnowledgeBoundary={
  allowed:['immediate-win','forced-block','center-preference','basic-line-pressure'],
  excluded:['compound-threat','fork-planning','lookahead-search','resource-planning','opponent-modeling'],
  patternAttention:{
    five:1,
    'open-four':1,
    four:.8,
    'open-three':.55,
    three:.3,
    'open-two':.12,
    two:.05,
    none:0,
  },
  searchDepth:0,
  teachingIntent:'readable-beginner',
};

export function easyPatternAttention(kind:CpuPatternKind){return EASY_KNOWLEDGE_BOUNDARY.patternAttention[kind];}
export function easyAllows(capability:EasyReasoningCapability){return EASY_KNOWLEDGE_BOUNDARY.allowed.includes(capability);}
