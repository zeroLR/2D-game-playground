import type { TargetState } from './TargetSystem';

export type EncounterImpactSource = 'ball' | 'split' | 'chain' | 'singularity';
export type EncounterModifierKind = 'drift-field';
export type EliteTrait = 'rune-ward';

export interface DriftFieldModifierDefinition {
  kind: 'drift-field';
  direction: 'clockwise' | 'counterclockwise';
  turnsPerSecond: number;
}

export type EncounterModifierDefinition = DriftFieldModifierDefinition;

export interface EliteDefinition {
  title: string;
  trait: EliteTrait;
}

export interface EncounterRuleSnapshot {
  modifierKinds: EncounterModifierKind[];
  driftDirection: DriftFieldModifierDefinition['direction'] | null;
  driftTurnsPerSecond: number;
  eliteTrait: EliteTrait | null;
  eliteTargetId: number | null;
}

export interface EncounterRuleSystemOptions {
  modifiers?: readonly EncounterModifierDefinition[];
  elite?: EliteDefinition;
}

const MAX_DRIFT_TURNS_PER_SECOND = 0.08;

export class EncounterRuleSystem {
  private readonly modifiers: readonly EncounterModifierDefinition[];
  private readonly elite: EliteDefinition | null;
  private eliteTargetId: number | null = null;

  constructor(options: EncounterRuleSystemOptions = {}) {
    this.modifiers = options.modifiers ?? [];
    this.elite = options.elite ?? null;
    this.validate();
  }

  get snapshot(): EncounterRuleSnapshot {
    const drift = this.modifiers.find((modifier) => modifier.kind === 'drift-field') ?? null;
    return {
      modifierKinds: this.modifiers.map((modifier) => modifier.kind),
      driftDirection: drift?.direction ?? null,
      driftTurnsPerSecond: drift?.turnsPerSecond ?? 0,
      eliteTrait: this.elite?.trait ?? null,
      eliteTargetId: this.eliteTargetId,
    };
  }

  bindEliteTarget(target: TargetState): void {
    if (!this.elite) return;
    if (target.role !== 'elite') {
      throw new Error('EncounterRuleSystem elite binding requires an elite target role.');
    }
    if (this.eliteTargetId !== null && this.eliteTargetId !== target.id) {
      throw new Error('EncounterRuleSystem supports one elite target per elite encounter.');
    }
    this.eliteTargetId = target.id;
  }

  allowsDamage(target: TargetState, source: EncounterImpactSource): boolean {
    if (!this.elite || target.id !== this.eliteTargetId) return true;
    switch (this.elite.trait) {
      case 'rune-ward':
        return source !== 'ball';
    }
  }

  movementLockedTargetIds(): ReadonlySet<number> {
    if (!this.elite || this.eliteTargetId === null) return EMPTY_TARGET_IDS;
    switch (this.elite.trait) {
      case 'rune-ward':
        return new Set([this.eliteTargetId]);
    }
  }

  driftOrbitFactor(dtSeconds: number): number {
    const drift = this.modifiers.find((modifier) => modifier.kind === 'drift-field');
    if (!drift) return 0;
    const dt = Number.isFinite(dtSeconds) ? Math.max(0, dtSeconds) : 0;
    const direction = drift.direction === 'clockwise' ? 1 : -1;
    return direction * drift.turnsPerSecond * Math.PI * 2 * dt;
  }

  eliteDefinition(): EliteDefinition | null {
    return this.elite ? { ...this.elite } : null;
  }

  private validate(): void {
    let driftCount = 0;
    for (const modifier of this.modifiers) {
      switch (modifier.kind) {
        case 'drift-field':
          driftCount += 1;
          if (!(modifier.turnsPerSecond > 0) || !Number.isFinite(modifier.turnsPerSecond)) {
            throw new Error('drift-field turnsPerSecond must be a positive finite number.');
          }
          if (modifier.turnsPerSecond > MAX_DRIFT_TURNS_PER_SECOND) {
            throw new Error(`drift-field turnsPerSecond must not exceed ${MAX_DRIFT_TURNS_PER_SECOND}.`);
          }
          break;
      }
    }
    if (driftCount > 1) throw new Error('EncounterRuleSystem supports at most one drift-field modifier.');
  }
}

const EMPTY_TARGET_IDS: ReadonlySet<number> = new Set<number>();
