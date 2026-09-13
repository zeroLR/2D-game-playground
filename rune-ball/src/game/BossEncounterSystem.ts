import type { ArenaBounds } from './BallModel';
import type { TargetKind } from './TargetSystem';
import type { Point2D } from '../input/SwipeClassifier';

export interface BossWardSpawn {
  kind: TargetKind;
  anchor: Point2D;
}

export interface BossPhaseDefinition {
  id: string;
  title: string;
  objective: string;
  exposureSeconds: number;
  wards: readonly BossWardSpawn[];
}

export interface BossDefinition {
  id: string;
  title: string;
  coreAnchor: Point2D;
  coreRadius: number;
  phases: readonly BossPhaseDefinition[];
}

export type BossState = 'idle' | 'shielded' | 'exposed' | 'defeated';

export interface BossSnapshot {
  id: string;
  title: string;
  state: BossState;
  phaseIndex: number;
  phaseNumber: number;
  totalPhases: number;
  phaseId: string | null;
  phaseTitle: string | null;
  phaseObjective: string | null;
  corePosition: Point2D;
  coreRadius: number;
  exposureSecondsRemaining: number;
  exposureDuration: number;
}

export type BossDirective =
  | {
      type: 'boss-phase-start';
      phaseIndex: number;
      total: number;
      phase: BossPhaseDefinition;
    }
  | {
      type: 'boss-exposed';
      phaseIndex: number;
      total: number;
      duration: number;
    }
  | {
      type: 'boss-core-blocked';
      phaseIndex: number;
      total: number;
    }
  | {
      type: 'boss-core-hit';
      phaseIndex: number;
      total: number;
    }
  | {
      type: 'boss-rearmed';
      phaseIndex: number;
      total: number;
      phase: BossPhaseDefinition;
    }
  | {
      type: 'boss-defeated';
      phases: number;
    };

const EXPOSURE_EPSILON_SECONDS = 0.000001;

export class BossEncounterSystem {
  private bounds: ArenaBounds;
  private readonly definition: BossDefinition;
  private state: BossState = 'idle';
  private phaseIndex = -1;
  private exposureSecondsRemaining = 0;
  private corePosition: Point2D;

  constructor(bounds: ArenaBounds, definition: BossDefinition) {
    this.bounds = bounds;
    this.definition = definition;
    this.validateDefinition(definition);
    this.corePosition = this.positionForAnchor(definition.coreAnchor, definition.coreRadius);
  }

  get snapshot(): BossSnapshot {
    const phase = this.currentPhase();
    return {
      id: this.definition.id,
      title: this.definition.title,
      state: this.state,
      phaseIndex: this.phaseIndex,
      phaseNumber: this.phaseIndex >= 0 ? this.phaseIndex + 1 : 0,
      totalPhases: this.definition.phases.length,
      phaseId: phase?.id ?? null,
      phaseTitle: phase?.title ?? null,
      phaseObjective: phase?.objective ?? null,
      corePosition: { ...this.corePosition },
      coreRadius: this.definition.coreRadius,
      exposureSecondsRemaining: this.exposureSecondsRemaining,
      exposureDuration: phase?.exposureSeconds ?? 0,
    };
  }

  start(): BossDirective[] {
    if (this.state !== 'idle') return [];
    this.phaseIndex = 0;
    this.state = 'shielded';
    this.exposureSecondsRemaining = 0;
    return [this.phaseStartDirective()];
  }

  setBounds(bounds: ArenaBounds): void {
    this.bounds = bounds;
    this.corePosition = this.positionForAnchor(this.definition.coreAnchor, this.definition.coreRadius);
  }

  update(dtSeconds: number, activeWardCount: number): BossDirective[] {
    if (this.state === 'idle' || this.state === 'defeated') return [];

    if (this.state === 'shielded') {
      if (activeWardCount > 0) return [];
      const phase = this.currentPhase();
      if (!phase) return [];
      this.state = 'exposed';
      this.exposureSecondsRemaining = phase.exposureSeconds;
      return [{
        type: 'boss-exposed',
        phaseIndex: this.phaseIndex,
        total: this.definition.phases.length,
        duration: phase.exposureSeconds,
      }];
    }

    const dt = Number.isFinite(dtSeconds) ? Math.max(0, dtSeconds) : 0;
    this.exposureSecondsRemaining = Math.max(0, this.exposureSecondsRemaining - dt);
    if (this.exposureSecondsRemaining > EXPOSURE_EPSILON_SECONDS) return [];

    const phase = this.currentPhase();
    if (!phase) return [];
    this.exposureSecondsRemaining = 0;
    this.state = 'shielded';
    return [{
      type: 'boss-rearmed',
      phaseIndex: this.phaseIndex,
      total: this.definition.phases.length,
      phase,
    }];
  }

  hitCore(): BossDirective[] {
    if (this.state === 'idle' || this.state === 'defeated') return [];

    if (this.state === 'shielded') {
      return [{
        type: 'boss-core-blocked',
        phaseIndex: this.phaseIndex,
        total: this.definition.phases.length,
      }];
    }

    const brokenPhaseIndex = this.phaseIndex;
    const directives: BossDirective[] = [{
      type: 'boss-core-hit',
      phaseIndex: brokenPhaseIndex,
      total: this.definition.phases.length,
    }];
    this.exposureSecondsRemaining = 0;

    if (brokenPhaseIndex >= this.definition.phases.length - 1) {
      this.state = 'defeated';
      directives.push({ type: 'boss-defeated', phases: this.definition.phases.length });
      return directives;
    }

    this.phaseIndex += 1;
    this.state = 'shielded';
    directives.push(this.phaseStartDirective());
    return directives;
  }

  collidesWithCore(point: Point2D, radius: number): boolean {
    const dx = point.x - this.corePosition.x;
    const dy = point.y - this.corePosition.y;
    const combined = Math.max(0, radius) + this.definition.coreRadius;
    return dx * dx + dy * dy <= combined * combined;
  }

  private currentPhase(): BossPhaseDefinition | null {
    return this.definition.phases[this.phaseIndex] ?? null;
  }

  private phaseStartDirective(): BossDirective {
    const phase = this.currentPhase();
    if (!phase) throw new Error('BossEncounterSystem cannot start a phase outside the authored definition.');
    return {
      type: 'boss-phase-start',
      phaseIndex: this.phaseIndex,
      total: this.definition.phases.length,
      phase,
    };
  }

  private validateDefinition(definition: BossDefinition): void {
    if (!(definition.coreRadius > 0) || !Number.isFinite(definition.coreRadius)) {
      throw new Error('BossEncounterSystem coreRadius must be a positive finite number.');
    }
    if (definition.phases.length === 0) {
      throw new Error('BossEncounterSystem requires at least one authored phase.');
    }
    for (const phase of definition.phases) {
      if (phase.wards.length === 0) {
        throw new Error(`Boss phase ${phase.id} must contain at least one Ward.`);
      }
      if (!(phase.exposureSeconds > 0) || !Number.isFinite(phase.exposureSeconds)) {
        throw new Error(`Boss phase ${phase.id} exposureSeconds must be a positive finite number.`);
      }
    }
  }

  private positionForAnchor(anchor: Point2D, radius: number): Point2D {
    const width = this.bounds.right - this.bounds.left;
    const height = this.bounds.bottom - this.bounds.top;
    return {
      x: this.clamp(
        this.bounds.left + width * this.clamp(anchor.x, 0, 1),
        this.bounds.left + radius,
        this.bounds.right - radius,
      ),
      y: this.clamp(
        this.bounds.top + height * this.clamp(anchor.y, 0, 1),
        this.bounds.top + radius,
        this.bounds.bottom - radius,
      ),
    };
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
