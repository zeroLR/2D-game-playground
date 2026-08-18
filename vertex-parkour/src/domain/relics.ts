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
    id: 'glass-anchor', name: 'GLASS ANCHOR', rarity: 'rare', sources: ['elite', 'treasure'],
    summary: 'LANDINGS HIT HARDER: MORE FLOW AND A STRONGER REBOUND',
    effect: { kind: 'movement-rule', triggers: ['landing'], description: 'Every landing grants extra Flow and empowers the automatic rebound jump.' },
  },
  'abyss-heart': {
    id: 'abyss-heart', name: 'ABYSS HEART', rarity: 'mythic', sources: ['elite', 'special'],
    summary: 'RUSH SUPPRESSES THE ABYSS; TAKING A HIT SURGES IT CLOSER',
    effect: { kind: 'survival-rule', triggers: ['flow-tier-entered', 'hit'], description: 'At Rush+ the Abyss approaches much slower; taking damage immediately advances it.' },
  },
  'storm-lens': {
    id: 'storm-lens', name: 'STORM LENS', rarity: 'rare', sources: ['treasure', 'special'],
    summary: 'READ THE STORM: RESIST ITS FORCE AND DASH WITH IT FOR FLOW',
    effect: { kind: 'environment-rule', triggers: ['storm-force', 'dash'], description: 'Storm force is reduced; dashing with an active surge converts its intensity into Flow.' },
  },
};

export const RELIC_POOL = Object.keys(RELICS) as RelicId[];
export type RelicInventory = ReadonlySet<RelicId>;
export function createEmptyRelicInventory(): RelicInventory { return new Set<RelicId>(); }
export function hasRelic(inventory: RelicInventory, id: RelicId) { return inventory.has(id); }
export function acquireRelic(inventory: RelicInventory, id: RelicId): RelicInventory { if (inventory.has(id)) return inventory; const next = new Set(inventory); next.add(id); return next; }
export function availableRelics(inventory: RelicInventory, source?: RelicSource): RelicId[] { return RELIC_POOL.filter((id) => !inventory.has(id) && (!source || RELICS[id].sources.includes(source))); }
export function relicsForTrigger(inventory: RelicInventory, trigger: RelicTrigger): RelicDefinition[] { return RELIC_POOL.filter((id) => inventory.has(id) && RELICS[id].effect.triggers.includes(trigger)).map((id) => RELICS[id]); }
