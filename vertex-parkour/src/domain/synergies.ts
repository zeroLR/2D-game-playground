import type { SkillLevels } from './skills';

export type SynergyId = 'momentum-loop' | 'predator-rhythm';

export type SynergyDefinition = {
  id: SynergyId;
  name: string;
  detail: string;
};

export const SYNERGIES: Record<SynergyId, SynergyDefinition> = {
  'momentum-loop': { id: 'momentum-loop', name: 'MOMENTUM LOOP', detail: 'DASH BUILDS EXTRA FLOW' },
  'predator-rhythm': { id: 'predator-rhythm', name: 'PREDATOR RHYTHM', detail: 'DRONE KILL BOOSTS NEXT JUMP' },
};

export function getActiveSynergies(skills: SkillLevels): SynergyId[] {
  const active: SynergyId[] = [];
  if (skills['phase-dash'] > 0 && skills.continuity > 0) active.push('momentum-loop');
  if (skills['kill-refund'] > 0 && skills.rebound > 0) active.push('predator-rhythm');
  return active;
}

export function hasSynergy(skills: SkillLevels, id: SynergyId) {
  return getActiveSynergies(skills).includes(id);
}
