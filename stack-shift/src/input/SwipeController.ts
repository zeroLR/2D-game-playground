export type ShiftDirection = { dx: number; dy: number };

export class SwipeController {
  private sx = 0;
  private sy = 0;

  constructor(element: HTMLElement, onShift: (direction: ShiftDirection) => void) {
    element.addEventListener('pointerdown', e => {
      this.sx = e.clientX; this.sy = e.clientY;
      element.setPointerCapture(e.pointerId);
    });
    element.addEventListener('pointerup', e => {
      const dx = e.clientX - this.sx, dy = e.clientY - this.sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 38) return;
      onShift(Math.abs(dx) > Math.abs(dy) ? { dx: dx > 0 ? 1 : -1, dy: 0 } : { dx: 0, dy: dy < 0 ? 1 : -1 });
    });
  }
}
