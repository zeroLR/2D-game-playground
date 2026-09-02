import type { Discovery, Trait } from '../synthesis/synthesis';

export type AffordanceId = 'SIGNAL_RELAY' | 'THERMAL_VENT';

export type AffordanceState = {
  activated: AffordanceId[];
};

export type AffordanceDefinition = {
  id: AffordanceId;
  requiredTrait: Trait;
  label: string;
};

export const AFFORDANCE_DEFINITIONS: Record<AffordanceId, AffordanceDefinition> = {
  SIGNAL_RELAY: { id: 'SIGNAL_RELAY', requiredTrait: 'CONDUCTIVE', label: 'SIGNAL RELAY' },
  THERMAL_VENT: { id: 'THERMAL_VENT', requiredTrait: 'HOT', label: 'THERMAL VENT' },
};

export function createAffordanceState(activated: AffordanceId[] = []): AffordanceState {
  return { activated: [...new Set(activated)] };
}

export function cloneAffordanceState(state: AffordanceState): AffordanceState {
  return createAffordanceState(state.activated);
}

export function isAffordanceActive(state: AffordanceState, id: AffordanceId): boolean {
  return state.activated.includes(id);
}

export function canActivateAffordance(id: AffordanceId, discovery: Discovery | null): boolean {
  if (!discovery) return false;
  return discovery.traits.includes(AFFORDANCE_DEFINITIONS[id].requiredTrait);
}

export type ActivateAffordanceResult = 'ACTIVATED' | 'ALREADY_ACTIVE' | 'MISSING_TRAIT';

export function activateAffordance(state: AffordanceState, id: AffordanceId, discovery: Discovery | null): ActivateAffordanceResult {
  if (isAffordanceActive(state, id)) return 'ALREADY_ACTIVE';
  if (!canActivateAffordance(id, discovery)) return 'MISSING_TRAIT';
  state.activated.push(id);
  return 'ACTIVATED';
}
