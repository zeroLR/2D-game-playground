import { MIN_DASH_STRENGTH } from '../domain/gameState';
import type { Direction, PlayerCommand } from './commands';

export const MIN_SWIPE_DISTANCE = 24;
export const DASH_SWIPE_THRESHOLD = 52;
export const MAX_SWIPE_DISTANCE = 120;

export function interpretSwipe(dx: number, dy: number, wallSide: -1 | 0 | 1): PlayerCommand | null {
  const distance = Math.abs(dx);
  if (distance < MIN_SWIPE_DISTANCE || distance <= Math.abs(dy)) return null;

  const direction: Direction = dx < 0 ? -1 : 1;

  if (wallSide !== 0 && direction === -wallSide) {
    return { type: 'wall-jump', direction };
  }

  if (distance < DASH_SWIPE_THRESHOLD) {
    const strength = Math.max(
      0.45,
      Math.min(1, (distance - MIN_SWIPE_DISTANCE) / (DASH_SWIPE_THRESHOLD - MIN_SWIPE_DISTANCE)),
    );
    return { type: 'air-nudge', direction, strength };
  }

  const normalized = Math.max(
    0,
    Math.min(1, (distance - DASH_SWIPE_THRESHOLD) / (MAX_SWIPE_DISTANCE - DASH_SWIPE_THRESHOLD)),
  );
  const strength = MIN_DASH_STRENGTH + normalized * (1 - MIN_DASH_STRENGTH);
  return { type: 'dash', direction, strength };
}

export function interpretKey(key: string, wallSide: -1 | 0 | 1, gameOver: boolean): PlayerCommand | null {
  if (key === 'r' && gameOver) return { type: 'restart' };
  if (key === 'a' || key === 'ArrowLeft') return interpretSwipe(-90, 0, wallSide);
  if (key === 'd' || key === 'ArrowRight') return interpretSwipe(90, 0, wallSide);
  return null;
}
