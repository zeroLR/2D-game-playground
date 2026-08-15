import type { ShiftDirection } from '../input/SwipeController';

export class HudController {
  private direction = document.querySelector<HTMLElement>('#direction')!;
  private gravityDot = document.querySelector<HTMLElement>('#gravity-dot')!;

  constructor() { document.querySelector<HTMLElement>('#moves')!.textContent = '∞'; }

  setGravity({ dx, dy }: ShiftDirection) {
    this.direction.textContent = dx < 0 ? 'GRAVITY ←' : dx > 0 ? 'GRAVITY →' : dy > 0 ? 'GRAVITY ↑' : 'GRAVITY ↓';
    this.gravityDot.style.transform = `translateX(${dx * 72}px)`;
  }

  reset() { this.direction.textContent = 'GRAVITY ↓'; this.gravityDot.style.transform = 'translateX(0)'; }
}
