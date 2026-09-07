export interface Point2D {
  x: number;
  y: number;
}

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

export interface SwipeIntent {
  direction: SwipeDirection;
  distance: number;
  vector: Point2D;
}

export const DEFAULT_SWIPE_THRESHOLD_PX = 28;

export function classifyDirectionalSwipe(
  start: Point2D,
  end: Point2D,
  minimumDistance = DEFAULT_SWIPE_THRESHOLD_PX,
): SwipeIntent | null {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);

  if (!Number.isFinite(distance) || distance < minimumDistance) return null;

  const horizontal = Math.abs(dx) >= Math.abs(dy);
  const direction: SwipeDirection = horizontal
    ? dx >= 0 ? 'right' : 'left'
    : dy >= 0 ? 'down' : 'up';

  return {
    direction,
    distance,
    vector: {
      x: dx / distance,
      y: dy / distance,
    },
  };
}

export function directionVector(direction: SwipeDirection): Point2D {
  switch (direction) {
    case 'up': return { x: 0, y: -1 };
    case 'down': return { x: 0, y: 1 };
    case 'left': return { x: -1, y: 0 };
    case 'right': return { x: 1, y: 0 };
  }
}
