import { availableRelics, type RelicId, type RelicInventory, type RelicSource } from './relics';
import type { EncounterType } from '../world/WorldGenerator';

export function relicSourceForEncounter(encounter: EncounterType): RelicSource | null {
  if (encounter === 'elite') return 'elite';
  if (encounter === 'treasure') return 'treasure';
  if (encounter === 'climax') return 'special';
  return null;
}

export function createRelicOffering(inventory: RelicInventory, source: RelicSource, limit = 2): RelicId[] {
  return availableRelics(inventory, source).slice(0, Math.max(0, limit));
}
