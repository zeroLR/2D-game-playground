export type SkillArchetype = 'dash' | 'jump' | 'kill' | 'flow';
export type SkillId =
  | 'phase-dash' | 'afterimage' | 'blink-reset'
  | 'rebound' | 'aerial-step' | 'impact'
  | 'kill-refund' | 'predator' | 'execution'
  | 'continuity' | 'overdrive' | 'flow-shield';

export type SkillDefinition = {
  id: SkillId;
  archetype: SkillArchetype;
  name: string;
  detail: string;
  maxTier: number;
};

export const SKILLS: Record<SkillId, SkillDefinition> = {
  'phase-dash': { id: 'phase-dash', archetype: 'dash', name: 'PHASE DASH', detail: 'DASH +10%', maxTier: 3 },
  afterimage: { id: 'afterimage', archetype: 'dash', name: 'AFTERIMAGE', detail: 'DASH EXTENDS CONTROL WINDOW', maxTier: 3 },
  'blink-reset': { id: 'blink-reset', archetype: 'dash', name: 'BLINK RESET', detail: 'HIGH FLOW LANDING REFUNDS DASH', maxTier: 1 },
  rebound: { id: 'rebound', archetype: 'jump', name: 'REBOUND', detail: 'LANDING LIFT +8%', maxTier: 3 },
  'aerial-step': { id: 'aerial-step', archetype: 'jump', name: 'AERIAL STEP', detail: 'AIR NUDGE +12%', maxTier: 3 },
  impact: { id: 'impact', archetype: 'jump', name: 'IMPACT', detail: 'LANDING BUILDS EXTRA FLOW', maxTier: 3 },
  'kill-refund': { id: 'kill-refund', archetype: 'kill', name: 'KILL REFUND', detail: 'DRONE FLOW +0.6', maxTier: 3 },
  predator: { id: 'predator', archetype: 'kill', name: 'PREDATOR', detail: 'KILL BOOSTS NEXT JUMP', maxTier: 3 },
  execution: { id: 'execution', archetype: 'kill', name: 'EXECUTION', detail: 'HIGH FLOW KILL BUILDS BONUS FLOW', maxTier: 3 },
  continuity: { id: 'continuity', archetype: 'flow', name: 'CONTINUITY', detail: 'FLOW GRACE +0.45s', maxTier: 3 },
  overdrive: { id: 'overdrive', archetype: 'flow', name: 'OVERDRIVE', detail: 'RUSH+ CONTROL +4%', maxTier: 3 },
  'flow-shield': { id: 'flow-shield', archetype: 'flow', name: 'FLOW SHIELD', detail: 'PERFECT FLOW ABSORBS A HIT', maxTier: 1 },
};

export const SKILL_POOL = Object.keys(SKILLS) as SkillId[];

export type SkillLevels = Record<SkillId, number>;

export function createEmptySkillLevels(): SkillLevels {
  return Object.fromEntries(SKILL_POOL.map((id) => [id, 0])) as SkillLevels;
}

export function getSkillTier(levels: SkillLevels, id: SkillId) { return levels[id]; }

export function applySkillLevel(levels: SkillLevels, id: SkillId): SkillLevels {
  const skill = SKILLS[id];
  return { ...levels, [id]: Math.min(skill.maxTier, levels[id] + 1) };
}

export function availableSkills(levels: SkillLevels): SkillId[] {
  return SKILL_POOL.filter((id) => levels[id] < SKILLS[id].maxTier);
}

export function skillsForArchetype(archetype: SkillArchetype): SkillId[] {
  return SKILL_POOL.filter((id) => SKILLS[id].archetype === archetype);
}
