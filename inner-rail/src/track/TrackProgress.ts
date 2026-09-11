import {
  TRACK_SECTION_LABELS,
  type RecoveryCheckpoint,
  type TrackPose,
  type TrackSectionId,
  type TrackVec3,
  type ValidationTrackDefinition,
} from './TestTrack.js';

export interface TrackProgressSnapshot {
  section: TrackSectionId;
  sectionLabel: string;
  checkpointId: string;
  checkpointIndex: number;
  goalHoldProgress: number;
  complete: boolean;
}

function distanceSquaredXZ(a: TrackVec3, b: TrackVec3): number {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return dx * dx + dz * dz;
}

function insideGoal(position: TrackVec3, track: ValidationTrackDefinition): boolean {
  const { center, halfExtents } = track.goal;
  return (
    Math.abs(position.x - center.x) <= halfExtents.x &&
    Math.abs(position.y - center.y) <= halfExtents.y &&
    Math.abs(position.z - center.z) <= halfExtents.z
  );
}

export class TrackProgress {
  private checkpointIndex = 0;
  private goalHoldSeconds = 0;
  private complete = false;

  constructor(private readonly track: ValidationTrackDefinition) {}

  reset(): void {
    this.checkpointIndex = 0;
    this.goalHoldSeconds = 0;
    this.complete = false;
  }

  update(position: TrackVec3, speed: number, deltaSeconds: number): void {
    this.advanceCheckpoint(position);

    if (this.complete) return;

    const dt = Math.min(Math.max(deltaSeconds, 0), 0.1);
    if (insideGoal(position, this.track) && speed <= this.track.goal.maxSpeed) {
      this.goalHoldSeconds += dt;
      if (this.goalHoldSeconds >= this.track.goal.holdSeconds) {
        this.goalHoldSeconds = this.track.goal.holdSeconds;
        this.complete = true;
      }
    } else {
      this.goalHoldSeconds = 0;
    }
  }

  recoveryPose(): TrackPose {
    return this.track.checkpoints[this.checkpointIndex].pose;
  }

  snapshot(position: TrackVec3): TrackProgressSnapshot {
    const section = this.nearestSection(position);
    return {
      section,
      sectionLabel: TRACK_SECTION_LABELS[section],
      checkpointId: this.track.checkpoints[this.checkpointIndex].id,
      checkpointIndex: this.checkpointIndex,
      goalHoldProgress: Math.min(1, this.goalHoldSeconds / this.track.goal.holdSeconds),
      complete: this.complete,
    };
  }

  private advanceCheckpoint(position: TrackVec3): void {
    for (let index = this.checkpointIndex + 1; index < this.track.checkpoints.length; index += 1) {
      const checkpoint = this.track.checkpoints[index];
      const radiusSquared = checkpoint.triggerRadius * checkpoint.triggerRadius;
      if (distanceSquaredXZ(position, checkpoint.trigger) <= radiusSquared) {
        this.checkpointIndex = index;
      }
    }
  }

  private nearestSection(position: TrackVec3): TrackSectionId {
    let nearestSection = this.track.pieces[0].section;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const piece of this.track.pieces) {
      const distance = distanceSquaredXZ(position, piece.position);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestSection = piece.section;
      }
    }

    return nearestSection;
  }
}

export function checkpointAt(
  track: ValidationTrackDefinition,
  index: number,
): RecoveryCheckpoint {
  return track.checkpoints[Math.min(track.checkpoints.length - 1, Math.max(0, index))];
}
