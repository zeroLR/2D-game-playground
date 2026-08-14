export type SkillArchetype = 'dash' | 'jump' | 'kill' | 'flow';
export type SkillId = 'phase-dash' | 'rebound' | 'kill-refund' | 'continuity';

export type SkillDefinition = {
  id: SkillId;
  archetype: SkillArchetype;
  name: string;
  detail: string;
  maxTier: number;
};

export const SKILLS: Record<SkillId, SkillDefinition> = {
  'phase-dash': { id: 'phase-dash', archetype: 'dash', name: 'PHASE DASH', detail: 'DASH +10%', maxTier: 3 },
  rebound: { id: 'rebound', archetype: 'jump', name: 'REBOUND', detail: 'LANDING LIFT +8%', maxTier: 3 },
  'kill-refund': { id: 'kill-refund', archetype: 'kill', name: 'KILL REFUND', detail: 'DRONE FLOW +0.6', maxTier: 3 },
  continuity: { id: 'continuity', archetype: 'flow', name: 'CONTINUITY', detail: 'FLOW GRACE +0.45s', maxTier: 3 },
};

export const SKILL_POOL = Object.keys(SKILLS) as SkillId[];

export type SkillLevels = Record<SkillId, number>;

export function createEmptySkillLevels(): SkillLevels {
  return { 'phase-dash': 0, rebound: 0, 'kill-refund': 0, continuity: 0 };
}

export function getSkillTier(levels: SkillLevels, id: SkillId) { return levels[id]; }

export function applySkillLevel(levels: SkillLevels, id: SkillId): SkillLevels {
  const skill = SKILLS[id];
  return { ...levels, [id]: Math.min(skill.maxTier, levels[id] + 1) };
}

export function availableSkills(levels: SkillLevels): SkillId[] {
  return SKILL_POOL.filter((id) => levels[id] < SKILLS[id].maxTier);
}
