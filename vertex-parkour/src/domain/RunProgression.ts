import type { BiomeId } from '../world/Biome';

export type RunPhase = 'running' | 'final-climax' | 'final-ascent' | 'chapter-clear';

export class RunProgression {
  private phase: RunPhase = 'running';

  getPhase(): RunPhase { return this.phase; }

  canGenerateProceduralWorld(): boolean {
    return this.phase === 'running' || this.phase === 'final-climax';
  }

  observeEncounter(biome: BiomeId, encounter: string, encounterStep: number) {
    if (biome !== 'storm-crown' || encounter !== 'climax') return;
    if (this.phase === 'running' && encounterStep === 0) this.phase = 'final-climax';
    if (this.phase === 'final-climax' && encounterStep === 3) this.phase = 'final-ascent';
  }

  markChapterClear() {
    if (this.phase === 'final-ascent') this.phase = 'chapter-clear';
  }

  reset() { this.phase = 'running'; }
}
