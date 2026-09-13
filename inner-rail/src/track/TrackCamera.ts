import type { TrackPiece, TrackVec3, ValidationTrackDefinition } from './TestTrack.js';

export interface TrackForwardSample {
  pieceId: string | null;
  yawRad: number;
  footprintDistance: number;
}

function horizontalDistanceToPieceFootprintSquared(position: TrackVec3, piece: TrackPiece): number {
  const dx = position.x - piece.position.x;
  const dz = position.z - piece.position.z;
  const yaw = piece.rotation.y;
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);

  // Transform the world-space offset into the authored piece's local X/Z frame.
  const localX = cos * dx - sin * dz;
  const localZ = sin * dx + cos * dz;
  const outsideX = Math.max(0, Math.abs(localX) - piece.size.x / 2);
  const outsideZ = Math.max(0, Math.abs(localZ) - piece.size.z / 2);
  return outsideX * outsideX + outsideZ * outsideZ;
}

/**
 * Returns the authored forward direction of the nearest track footprint.
 *
 * Local +Z remains route-forward. P2 rooms can stack upper and lower routes in
 * the same horizontal footprint, so vertical proximity breaks ties before the
 * old horizontal center-distance fallback. Flat P0/P1 tracks keep identical
 * behavior while stacked routes no longer inherit the yaw of the floor below.
 */
export function resolveTrackForward(
  position: TrackVec3,
  track: ValidationTrackDefinition,
  fallbackYawRad = 0,
): TrackForwardSample {
  let bestPiece: TrackPiece | null = null;
  let bestFootprintDistanceSq = Number.POSITIVE_INFINITY;
  let bestVerticalDistanceSq = Number.POSITIVE_INFINITY;
  let bestCenterDistanceSq = Number.POSITIVE_INFINITY;

  for (const piece of track.pieces) {
    const footprintDistanceSq = horizontalDistanceToPieceFootprintSquared(position, piece);
    const dx = position.x - piece.position.x;
    const dy = position.y - piece.position.y;
    const dz = position.z - piece.position.z;
    const verticalDistanceSq = dy * dy;
    const centerDistanceSq = dx * dx + dz * dz;

    const footprintIsCloser = footprintDistanceSq < bestFootprintDistanceSq - 1e-9;
    const sameFootprintDistance = Math.abs(footprintDistanceSq - bestFootprintDistanceSq) <= 1e-9;
    const verticalIsCloser = verticalDistanceSq < bestVerticalDistanceSq - 1e-9;
    const sameVerticalDistance = Math.abs(verticalDistanceSq - bestVerticalDistanceSq) <= 1e-9;

    if (
      footprintIsCloser ||
      (sameFootprintDistance && verticalIsCloser) ||
      (sameFootprintDistance && sameVerticalDistance && centerDistanceSq < bestCenterDistanceSq)
    ) {
      bestPiece = piece;
      bestFootprintDistanceSq = footprintDistanceSq;
      bestVerticalDistanceSq = verticalDistanceSq;
      bestCenterDistanceSq = centerDistanceSq;
    }
  }

  if (!bestPiece) {
    return { pieceId: null, yawRad: fallbackYawRad, footprintDistance: Number.POSITIVE_INFINITY };
  }

  return {
    pieceId: bestPiece.id,
    yawRad: bestPiece.rotation.y,
    footprintDistance: Math.sqrt(bestFootprintDistanceSq),
  };
}
