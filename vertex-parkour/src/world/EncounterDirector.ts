import type { BiomeId } from './Biome';

export type CoreEncounter = 'recovery' | 'dash-chain' | 'edge-read' | 'wall-rescue' | 'moving-window';
export type PacingPhase = 'warmup' | 'flow' | 'pressure';
type WeightedEncounter = { type: CoreEncounter; weight: number };

const TEAL_DECKS: Record<PacingPhase, WeightedEncounter[]> = {
  warmup: [{ type: 'recovery', weight: 4 }, { type: 'dash-chain', weight: 3 }, { type: 'edge-read', weight: 2 }, { type: 'wall-rescue', weight: 1 }, { type: 'moving-window', weight: 1 }],
  flow: [{ type: 'recovery', weight: 2 }, { type: 'dash-chain', weight: 4 }, { type: 'edge-read', weight: 3 }, { type: 'wall-rescue', weight: 3 }, { type: 'moving-window', weight: 3 }],
  pressure: [{ type: 'recovery', weight: 1 }, { type: 'dash-chain', weight: 4 }, { type: 'edge-read', weight: 4 }, { type: 'wall-rescue', weight: 4 }, { type: 'moving-window', weight: 5 }],
};
const AMBER_DECKS: Record<PacingPhase, WeightedEncounter[]> = {
  warmup: [{ type: 'recovery', weight: 2 }, { type: 'dash-chain', weight: 4 }, { type: 'edge-read', weight: 3 }, { type: 'wall-rescue', weight: 1 }, { type: 'moving-window', weight: 3 }],
  flow: [{ type: 'recovery', weight: 1 }, { type: 'dash-chain', weight: 5 }, { type: 'edge-read', weight: 4 }, { type: 'wall-rescue', weight: 2 }, { type: 'moving-window', weight: 5 }],
  pressure: [{ type: 'recovery', weight: 1 }, { type: 'dash-chain', weight: 5 }, { type: 'edge-read', weight: 5 }, { type: 'wall-rescue', weight: 2 }, { type: 'moving-window', weight: 6 }],
};
const VIOLET_DECKS: Record<PacingPhase, WeightedEncounter[]> = {
  warmup: [{ type: 'recovery', weight: 2 }, { type: 'dash-chain', weight: 2 }, { type: 'edge-read', weight: 4 }, { type: 'wall-rescue', weight: 4 }, { type: 'moving-window', weight: 1 }],
  flow: [{ type: 'recovery', weight: 1 }, { type: 'dash-chain', weight: 2 }, { type: 'edge-read', weight: 5 }, { type: 'wall-rescue', weight: 6 }, { type: 'moving-window', weight: 3 }],
  pressure: [{ type: 'recovery', weight: 1 }, { type: 'dash-chain', weight: 2 }, { type: 'edge-read', weight: 6 }, { type: 'wall-rescue', weight: 7 }, { type: 'moving-window', weight: 4 }],
};
const PALE_DECKS: Record<PacingPhase, WeightedEncounter[]> = {
  warmup: [{ type: 'recovery', weight: 2 }, { type: 'dash-chain', weight: 4 }, { type: 'edge-read', weight: 1 }, { type: 'wall-rescue', weight: 1 }, { type: 'moving-window', weight: 5 }],
  flow: [{ type: 'recovery', weight: 1 }, { type: 'dash-chain', weight: 5 }, { type: 'edge-read', weight: 2 }, { type: 'wall-rescue', weight: 1 }, { type: 'moving-window', weight: 7 }],
  pressure: [{ type: 'recovery', weight: 1 }, { type: 'dash-chain', weight: 6 }, { type: 'edge-read', weight: 2 }, { type: 'wall-rescue', weight: 1 }, { type: 'moving-window', weight: 8 }],
};
// Storm Crown is the Chapter 1 mastery test: no single earlier vocabulary owns
// the deck. Dash, edge commitment, walls and moving timing all return at high
// weight, while recovery is intentionally scarce.
const STORM_DECKS: Record<PacingPhase, WeightedEncounter[]> = {
  warmup: [{ type: 'recovery', weight: 1 }, { type: 'dash-chain', weight: 4 }, { type: 'edge-read', weight: 4 }, { type: 'wall-rescue', weight: 3 }, { type: 'moving-window', weight: 4 }],
  flow: [{ type: 'recovery', weight: 1 }, { type: 'dash-chain', weight: 5 }, { type: 'edge-read', weight: 5 }, { type: 'wall-rescue', weight: 4 }, { type: 'moving-window', weight: 5 }],
  pressure: [{ type: 'recovery', weight: 1 }, { type: 'dash-chain', weight: 6 }, { type: 'edge-read', weight: 6 }, { type: 'wall-rescue', weight: 5 }, { type: 'moving-window', weight: 6 }],
};

function deckFor(biome: BiomeId, phase: PacingPhase) {
  if (biome === 'storm-crown') return STORM_DECKS[phase];
  if (biome === 'pale-heights') return PALE_DECKS[phase];
  if (biome === 'violet-zone') return VIOLET_DECKS[phase];
  if (biome === 'amber-district') return AMBER_DECKS[phase];
  return TEAL_DECKS[phase];
}

export function pacingPhaseFor(encounterIndex: number): PacingPhase {
  if (encounterIndex < 4) return 'warmup';
  if (encounterIndex < 10) return 'flow';
  return 'pressure';
}

export class EncounterDirector {
  private coreEncounterIndex = 0;
  private last: CoreEncounter | null = null;
  private repeatCount = 0;
  reset() { this.coreEncounterIndex = 0; this.last = null; this.repeatCount = 0; }
  getPhase() { return pacingPhaseFor(this.coreEncounterIndex); }
  next(random: () => number, biome: BiomeId = 'teal-ruins'): CoreEncounter {
    const phase = this.getPhase();
    let deck = deckFor(biome, phase);
    if (this.repeatCount >= 1 && this.last) deck = deck.filter((entry) => entry.type !== this.last);
    const total = deck.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = random() * total;
    let selected = deck[deck.length - 1].type;
    for (const entry of deck) { roll -= entry.weight; if (roll < 0) { selected = entry.type; break; } }
    if (selected === this.last) this.repeatCount += 1;
    else { this.last = selected; this.repeatCount = 0; }
    this.coreEncounterIndex += 1;
    return selected;
  }
}
