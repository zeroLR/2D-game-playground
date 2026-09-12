import type { CameraTelemetry } from '../camera/FirstPersonCamera';
import type { TiltSnapshot } from '../input/TiltInput';
import type { WorldGravityDirection } from '../physics/gravityMath';
import type { BallState } from '../physics/PhysicsWorld';
import type { TrackProgressSnapshot } from '../track/TrackProgress';
import type { ValidationRunSnapshot, ValidationRunSummary } from '../validation/ValidationRun';

function fixed(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : value.toFixed(2);
}

function viewportOrientation(): 'portrait' | 'landscape' {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

function bestRunLabel(run: ValidationRunSummary | null): string {
  if (!run) return '—';
  return `${run.durationSeconds.toFixed(1)}s / ${run.fallCount} falls`;
}

export interface RuntimeTelemetry {
  ball: BallState;
  camera: CameraTelemetry;
  track: TrackProgressSnapshot;
  validation: ValidationRunSnapshot;
  validationEnabled: boolean;
  modeLabel: string;
  bestPortrait: ValidationRunSummary | null;
  bestLandscape: ValidationRunSummary | null;
  worldGravity: WorldGravityDirection;
  fallResetCount: number;
  gameplayActive: boolean;
}

export class PrototypeTelemetry {
  constructor(private readonly root: HTMLElement) {}

  render(snapshot: TiltSnapshot, runtime: RuntimeTelemetry): void {
    const raw = snapshot.raw;
    const validationLines = runtime.validationEnabled
      ? [
          `validation  ${runtime.validation.active ? `${runtime.validation.elapsedSeconds.toFixed(1)}s` : 'inactive'}  falls ${runtime.validation.fallCount}`,
          `best device portrait ${bestRunLabel(runtime.bestPortrait)}`,
          `best device landscape ${bestRunLabel(runtime.bestLandscape)}`,
        ]
      : [];
    this.root.textContent = [
      `prototype   ${runtime.modeLabel}`,
      `mode        ${runtime.gameplayActive ? 'physics active' : 'paused'}`,
      `source      ${snapshot.source ?? 'none'}`,
      `viewport    ${viewportOrientation()}  ${window.innerWidth}×${window.innerHeight}`,
      ...validationLines,
      `section     ${runtime.track.sectionLabel}`,
      `checkpoint  ${runtime.track.checkpointId}  goal ${Math.round(runtime.track.goalHoldProgress * 100)}%${runtime.track.complete ? ' COMPLETE' : ''}`,
      `magnetic    ${runtime.ball.magnetic.active ? `${runtime.ball.magnetic.pieceId ?? 'active'}  ${Math.round(runtime.ball.magnetic.strength * 100)}%` : 'off'}`,
      `screen deg  x ${fixed(snapshot.screenTiltDeg.x)}  y ${fixed(snapshot.screenTiltDeg.y)}`,
      `neutral     x ${fixed(snapshot.neutral?.x)}  y ${fixed(snapshot.neutral?.y)}`,
      `relative    x ${fixed(snapshot.relativeTiltDeg.x)}  y ${fixed(snapshot.relativeTiltDeg.y)}`,
      `filtered    x ${fixed(snapshot.normalized.x)}  y ${fixed(snapshot.normalized.y)}`,
      `gravity cam x ${fixed(snapshot.gravityDirection.x)}  y ${fixed(snapshot.gravityDirection.y)}  z ${fixed(snapshot.gravityDirection.z)}`,
      `gravity wrd x ${fixed(runtime.worldGravity.x)}  y ${fixed(runtime.worldGravity.y)}  z ${fixed(runtime.worldGravity.z)}`,
      `ball pos    x ${fixed(runtime.ball.position.x)}  y ${fixed(runtime.ball.position.y)}  z ${fixed(runtime.ball.position.z)}`,
      `velocity    x ${fixed(runtime.ball.velocity.x)}  y ${fixed(runtime.ball.velocity.y)}  z ${fixed(runtime.ball.velocity.z)}`,
      `speed       ${fixed(runtime.ball.speed)}  grounded ${runtime.ball.grounded ? 'yes' : 'no'}`,
      `camera yaw  ${fixed(runtime.camera.yawRad)} → ${fixed(runtime.camera.targetYawRad)}  pitch ${fixed(runtime.camera.pitchRad)}`,
      `heading     ${runtime.camera.headingState}  err ${fixed(runtime.camera.headingErrorRad)}`,
      `camera fov  ${fixed(runtime.camera.fovDeg)}°  resets ${runtime.fallResetCount}`,
      `raw beta    ${fixed(raw?.betaDeg)}  gamma ${fixed(raw?.gammaDeg)}  screen ${fixed(raw?.screenAngleDeg)}`,
    ].join('\n');
  }
}
