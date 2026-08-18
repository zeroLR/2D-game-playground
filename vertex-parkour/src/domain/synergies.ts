import type { SkillLevels } from './skills';

export type SynergyId =
  | 'momentum-loop'
  | 'blink-drive'
  | 'predator-rhythm'
  | 'execution-impact';

export type SynergyDefinition = {
  id: SynergyId;
  name: string;
  detail: string;
};

export const SYNERGIES: Record<SynergyId, SynergyDefinition> = {
  'momentum-loop': { id: 'momentum-loop', name: 'MOMENTUM LOOP', detail: 'PHASE DASH + CONTINUITY: DASH BUILDS EXTRA FLOW' },
  'blink-drive': { id: 'blink-drive', name: 'BLINK DRIVE', detail: 'BLINK RESET + OVERDRIVE: RUSH+ DRONE KILLS REFUND DASH FOR AIRBORNE CHAINS' },
  'predator-rhythm': { id: 'predator-rhythm', name: 'PREDATOR RHYTHM', detail: 'KILL REFUND + REBOUND: KILL BOOSTS NEXT JUMP' },
  'execution-impact': { id: 'execution-impact', name: 'EXECUTION IMPACT', detail: 'EXECUTION + IMPACT: KILLS PRIME THE NEXT LANDING FOR BONUS FLOW' },
};

export function getActiveSynergies(skills: SkillLevels): SynergyId[] {
  const active: SynergyId[] = [];
  if (skills['phase-dash'] > 0 && skills.continuity > 0) active.push('momentum-loop');
  if (skills['blink-reset'] > 0 && skills.overdrive > 0) active.push('blink-drive');
  if (skills['kill-refund'] > 0 && skills.rebound > 0) active.push('predator-rhythm');
  if (skills.execution > 0 && skills.impact > 0) active.push('execution-impact');
  return active;
}

export function hasSynergy(skills: SkillLevels, id: SynergyId) {
  return getActiveSynergies(skills).includes(id);
}
