import type { TrackPiece, TrackVec3 } from './TestTrack.js';

export interface TrackMotionSample {
  pieceId: string;
  position: TrackVec3;
  rotation: TrackVec3;
  linearVelocity: TrackVec3;
}

function normalizedAxis(axis: TrackVec3): TrackVec3 {
  const length = Math.hypot(axis.x, axis.y, axis.z);
  if (length <= 1e-9) return { x: 0, y: 0, z: 0 };
  return { x: axis.x / length, y: axis.y / length, z: axis.z / length };
}

export function sampleTrackPieceMotion(piece: TrackPiece, elapsedSeconds: number): TrackMotionSample {
  const motion = piece.motion;
  if (!motion) {
    return {
      pieceId: piece.id,
      position: { ...piece.position },
      rotation: { ...piece.rotation },
      linearVelocity: { x: 0, y: 0, z: 0 },
    };
  }

  const periodSeconds = Math.max(0.001, motion.periodSeconds);
  const omega = (Math.PI * 2) / periodSeconds;
  const phase = omega * Math.max(0, elapsedSeconds) + (motion.phaseRad ?? 0);
  const axis = normalizedAxis(motion.axis);
  const offset = motion.amplitude * Math.sin(phase);
  const speed = motion.amplitude * omega * Math.cos(phase);

  return {
    pieceId: piece.id,
    position: {
      x: piece.position.x + axis.x * offset,
      y: piece.position.y + axis.y * offset,
      z: piece.position.z + axis.z * offset,
    },
    rotation: { ...piece.rotation },
    linearVelocity: {
      x: axis.x * speed,
      y: axis.y * speed,
      z: axis.z * speed,
    },
  };
}
