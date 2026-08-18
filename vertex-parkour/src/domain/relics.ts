export type RelicRarity = 'rare' | 'mythic';
export type RelicSource = 'elite' | 'treasure' | 'special';
export type RelicTrigger = 'dash' | 'landing' | 'kill' | 'hit' | 'flow-tier-entered' | 'storm-force' | 'wall-contact';
export type RelicEffectKind = 'movement-rule' | 'flow-rule' | 'survival-rule' | 'environment-rule';

export type RelicId =
  | 'glass-anchor'
  | 'abyss-heart'
  | 'storm-lens';

export type RelicEffect = {
  kind: RelicEffectKind;
  triggers: RelicTrigger[];
  description: string;
};

export type RelicDefinition = {
  id: RelicId;
  name: string;
  rarity: RelicRarity;
  sources: RelicSource[];
  summary: string;
  effect: RelicEffect;
};

export const RELICS: Record<RelicId, RelicDefinition> = {
  'glass-anchor': {
    id: 'glass-anchor',
    name: 'GLASS ANCHOR',
    rarity: 'rare',
    sources: ['elite', 'treasure'],
    summary: 'LANDING RESETS DASH; LONG PLATFORM STAYS BECOME DANGEROUS',
    effect: {
      kind: 'movement-rule',
      triggers: ['landing'],
      description: 'Traversal-rule relic reserved for M8.2 implementation.',
    },
  },
  'abyss-heart': {
    id: 'abyss-heart',
    name: 'ABYSS HEART',
    rarity: 'mythic',
    sources: ['elite', 'special'],
    summary: 'HIGH FLOW SUPPRESSES ABYSS PRESSURE; LOSING FLOW HAS A COST',
    effect: {
      kind: 'survival-rule',
      triggers: ['flow-tier-entered', 'hit'],
      description: 'Pressure-rule relic reserved for M8.2 implementation.',
    },
  },
  'storm-lens': {
    id: 'storm-lens',
    name: 'STORM LENS',
    rarity: 'rare',
    sources: ['treasure', 'special'],
    summary: 'STORM PRESSURE BECOMES A MOVEMENT RESOURCE',
    effect: {
      kind: 'environment-rule',
      triggers: ['storm-force', 'dash'],
      description: 'Environment-rule relic reserved for M8.2 implementation.',
    },
  },
};

export const RELIC_POOL = Object.keys(RELICS) as RelicId[];

export type RelicInventory = ReadonlySet<RelicId>;

export function createEmptyRelicInventory(): RelicInventory {
  return new Set<RelicId>();
}

export function hasRelic(inventory: RelicInventory, id: RelicId) {
  return inventory.has(id);
}

export function acquireRelic(inventory: RelicInventory, id: RelicId): RelicInventory {
  if (inventory.has(id)) return inventory;
  const next = new Set(inventory);
  next.add(id);
  return next;
}

export function availableRelics(inventory: RelicInventory, source?: RelicSource): RelicId[] {
  return RELIC_POOL.filter((id) => !inventory.has(id) && (!source || RELICS[id].sources.includes(source)));
}

export function relicsForTrigger(inventory: RelicInventory, trigger: RelicTrigger): RelicDefinition[] {
  return RELIC_POOL.filter((id) => inventory.has(id) && RELICS[id].effect.triggers.includes(trigger)).map((id) => RELICS[id]);
}
