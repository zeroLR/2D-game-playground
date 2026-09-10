import type { ArenaBounds } from '../game/BallModel';

export interface ArenaLayout {
  bounds: ArenaBounds;
  scoreY: number;
  flowBarY: number;
  runeBarY: number;
  runeGuideY: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateArenaLayout(width: number, height: number): ArenaLayout {
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const arenaWidth = Math.min(safeWidth * 0.88, 400);

  // Reserve real screen-space gutters for telemetry and Rune state instead of
  // drawing HUD inside the collision surface. The minimums protect short phones;
  // the proportional values keep taller devices visually balanced.
  const topReserve = clamp(safeHeight * 0.14, 96, 122);
  const bottomReserve = clamp(safeHeight * 0.14, 88, 118);
  const availableHeight = Math.max(240, safeHeight - topReserve - bottomReserve);
  const desiredArenaHeight = Math.min(safeHeight * 0.76, arenaWidth * 1.58);
  const arenaHeight = Math.min(desiredArenaHeight, availableHeight);
  const centerX = safeWidth / 2;
  const centerY = topReserve + availableHeight / 2;

  const bounds: ArenaBounds = {
    left: centerX - arenaWidth / 2,
    right: centerX + arenaWidth / 2,
    top: centerY - arenaHeight / 2,
    bottom: centerY + arenaHeight / 2,
  };

  return {
    bounds,
    scoreY: Math.max(58, bounds.top - 32),
    flowBarY: bounds.top - 12,
    runeBarY: bounds.bottom + 10,
    runeGuideY: bounds.bottom + 34,
  };
}
