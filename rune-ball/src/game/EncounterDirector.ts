import type { Point2D } from '../input/SwipeClassifier';
import type { TargetKind } from './TargetSystem';

export interface EncounterTargetSpawn {
  kind: TargetKind;
  anchor: Point2D;
}

export interface EncounterDefinition {
  id: string;
  title: string;
  objective: string;
  targets: readonly EncounterTargetSpawn[];
}

export interface EncounterSequenceDefinition {
  intermissionSeconds: number;
  encounters: readonly EncounterDefinition[];
}

export type EncounterPhase = 'idle' | 'active' | 'intermission' | 'complete';

export interface EncounterSnapshot {
  phase: EncounterPhase;
  index: number;
  total: number;
  currentId: string | null;
  currentTitle: string | null;
  currentObjective: string | null;
  intermissionSecondsRemaining: number;
}

export type EncounterDirective =
  | {
      type: 'encounter-start';
      index: number;
      total: number;
      encounter: EncounterDefinition;
    }
  | {
      type: 'encounter-clear';
      index: number;
      total: number;
      encounterId: string;
    }
  | {
      type: 'stage-clear';
      total: number;
    };

const INTERMISSION_EPSILON_SECONDS = 0.000001;

export class EncounterDirector {
  private readonly sequence: EncounterSequenceDefinition;
  private phase: EncounterPhase = 'idle';
  private index = -1;
  private intermissionSecondsRemaining = 0;

  constructor(sequence: EncounterSequenceDefinition) {
    if (sequence.encounters.length === 0) {
      throw new Error('EncounterDirector requires at least one authored encounter.');
    }
    if (!Number.isFinite(sequence.intermissionSeconds) || sequence.intermissionSeconds < 0) {
      throw new Error('EncounterDirector intermissionSeconds must be a non-negative finite number.');
    }
    for (const encounter of sequence.encounters) {
      if (encounter.targets.length === 0) {
        throw new Error(`Encounter ${encounter.id} must contain at least one target.`);
      }
    }
    this.sequence = sequence;
  }

  get snapshot(): EncounterSnapshot {
    const current = this.currentEncounter();
    return {
      phase: this.phase,
      index: this.index,
      total: this.sequence.encounters.length,
      currentId: current?.id ?? null,
      currentTitle: current?.title ?? null,
      currentObjective: current?.objective ?? null,
      intermissionSecondsRemaining: this.intermissionSecondsRemaining,
    };
  }

  start(): EncounterDirective[] {
    if (this.phase !== 'idle') return [];
    this.index = 0;
    this.phase = 'active';
    return [this.startDirective()];
  }

  update(dtSeconds: number, activeTargetCount: number): EncounterDirective[] {
    if (this.phase === 'idle' || this.phase === 'complete') return [];

    if (this.phase === 'active') {
      if (activeTargetCount > 0) return [];

      const encounter = this.currentEncounter();
      if (!encounter) return [];

      const directives: EncounterDirective[] = [{
        type: 'encounter-clear',
        index: this.index,
        total: this.sequence.encounters.length,
        encounterId: encounter.id,
      }];

      if (this.index >= this.sequence.encounters.length - 1) {
        this.phase = 'complete';
        this.intermissionSecondsRemaining = 0;
        directives.push({ type: 'stage-clear', total: this.sequence.encounters.length });
        return directives;
      }

      this.phase = 'intermission';
      this.intermissionSecondsRemaining = this.sequence.intermissionSeconds;
      return directives;
    }

    const dt = Number.isFinite(dtSeconds) ? Math.max(0, dtSeconds) : 0;
    this.intermissionSecondsRemaining = Math.max(0, this.intermissionSecondsRemaining - dt);
    if (this.intermissionSecondsRemaining > INTERMISSION_EPSILON_SECONDS) return [];
    this.intermissionSecondsRemaining = 0;

    this.index += 1;
    this.phase = 'active';
    return [this.startDirective()];
  }

  private currentEncounter(): EncounterDefinition | null {
    return this.sequence.encounters[this.index] ?? null;
  }

  private startDirective(): EncounterDirective {
    const encounter = this.currentEncounter();
    if (!encounter) throw new Error('EncounterDirector cannot start an encounter outside the sequence.');
    return {
      type: 'encounter-start',
      index: this.index,
      total: this.sequence.encounters.length,
      encounter,
    };
  }
}
