import type { RuneKind } from '../rune/RuneTypes';

export interface AscensionSnapshot {
  rune: 'vortex';
  ascension: 'singularity';
  energy: number;
  maxEnergy: number;
  ready: boolean;
  releases: number;
}

const MAX_ENERGY = 100;
const VORTEX_CAST_ENERGY = 25;

export class AscensionSystem {
  private energy = 0;
  private releases = 0;

  get snapshot(): AscensionSnapshot {
    return {
      rune: 'vortex',
      ascension: 'singularity',
      energy: this.energy,
      maxEnergy: MAX_ENERGY,
      ready: this.energy >= MAX_ENERGY,
      releases: this.releases,
    };
  }

  registerRuneActivation(rune: RuneKind): boolean {
    if (rune !== 'vortex' || this.energy >= MAX_ENERGY) return false;
    const wasReady = this.energy >= MAX_ENERGY;
    this.energy = Math.min(MAX_ENERGY, this.energy + VORTEX_CAST_ENERGY);
    return !wasReady && this.energy >= MAX_ENERGY;
  }

  consume(): boolean {
    if (this.energy < MAX_ENERGY) return false;
    this.energy = 0;
    this.releases += 1;
    return true;
  }

  reset(): void {
    this.energy = 0;
    this.releases = 0;
  }
}
