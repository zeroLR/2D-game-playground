import type { GridPosition } from '../domain/model';

export interface UiRect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface BoardLayout {
  readonly columns: number;
  readonly rows: number;
  readonly margin: number;
  readonly boardX: number;
  readonly boardY: number;
  readonly pageSize: number;
  readonly gap: number;
  readonly boardWidth: number;
  readonly boardHeight: number;
  readonly rotateButton: UiRect;
  readonly resetButton: UiRect;
  readonly feedbackY: number;
}

const MIN_TOUCH_TARGET = 44;

export function computeBoardLayout(width: number, height: number, columns = 3, rows = 3): BoardLayout {
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const margin = clamp(Math.round(safeWidth * 0.055), 16, 28);
  const headerBottom = Math.max(104, Math.round(safeHeight * 0.14));
  const controlHeight = Math.max(MIN_TOUCH_TARGET, 52);
  const controlGap = 12;
  const resetWidth = 104;
  const footerReserve = controlHeight + 80;
  const maxBoardWidth = Math.max(1, safeWidth - margin * 2);
  const maxBoardHeight = Math.max(1, safeHeight - headerBottom - footerReserve);
  const targetBoardSize = Math.min(maxBoardWidth, maxBoardHeight, 372);
  const gap = clamp(Math.round(targetBoardSize * 0.018), 4, 8);
  const pageSize = Math.max(1, Math.floor((targetBoardSize - gap * (columns - 1)) / columns));
  const boardWidth = pageSize * columns + gap * (columns - 1);
  const boardHeight = pageSize * rows + gap * (rows - 1);
  const boardX = Math.round((safeWidth - boardWidth) / 2);
  const boardY = Math.round(headerBottom + Math.max(0, (maxBoardHeight - boardHeight) / 2));

  const groupWidth = controlHeight + controlGap + resetWidth;
  const controlsX = Math.round((safeWidth - groupWidth) / 2);
  const desiredControlY = boardY + boardHeight + 18;
  const controlY = Math.min(desiredControlY, safeHeight - controlHeight - 36);

  return {
    columns,
    rows,
    margin,
    boardX,
    boardY,
    pageSize,
    gap,
    boardWidth,
    boardHeight,
    rotateButton: { x: controlsX, y: controlY, width: controlHeight, height: controlHeight },
    resetButton: {
      x: controlsX + controlHeight + controlGap,
      y: controlY,
      width: resetWidth,
      height: controlHeight,
    },
    feedbackY: Math.min(safeHeight - 20, controlY + controlHeight + 24),
  };
}

export function cellRect(layout: BoardLayout, position: GridPosition): UiRect {
  return {
    x: layout.boardX + position.column * (layout.pageSize + layout.gap),
    y: layout.boardY + position.row * (layout.pageSize + layout.gap),
    width: layout.pageSize,
    height: layout.pageSize,
  };
}

export function gridPositionAtPoint(layout: BoardLayout, x: number, y: number): GridPosition | null {
  const localX = x - layout.boardX;
  const localY = y - layout.boardY;
  if (localX < 0 || localY < 0 || localX >= layout.boardWidth || localY >= layout.boardHeight) return null;

  const span = layout.pageSize + layout.gap;
  const column = Math.floor(localX / span);
  const row = Math.floor(localY / span);
  if (column < 0 || row < 0 || column >= layout.columns || row >= layout.rows) return null;

  const withinCellX = localX - column * span;
  const withinCellY = localY - row * span;
  if (withinCellX >= layout.pageSize || withinCellY >= layout.pageSize) return null;
  return { row, column };
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
