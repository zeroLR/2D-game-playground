import type { ShiftDirection } from '../input/SwipeController';

export class HudController {
  private direction = document.querySelector<HTMLElement>('#direction')!;
  private gravityDot = document.querySelector<HTMLElement>('#gravity-dot')!;
  private moves = document.querySelector<HTMLElement>('#moves')!;
  private overlay = document.querySelector<HTMLElement>('#result')!;
  private resultTitle = document.querySelector<HTMLElement>('#result-title')!;
  private resultCopy = document.querySelector<HTMLElement>('#result-copy')!;

  setMoves(value: number) { this.moves.textContent = String(value); }

  setGravity({ dx, dy }: ShiftDirection) {
    this.direction.textContent = dx < 0 ? 'GRAVITY ←' : dx > 0 ? 'GRAVITY →' : dy > 0 ? 'GRAVITY ↑' : 'GRAVITY ↓';
    this.gravityDot.style.transform = `translateX(${dx * 72}px)`;
  }

  showResult(won: boolean) {
    this.resultTitle.textContent = won ? 'CLEAR!' : 'OUT OF SHIFTS';
    this.resultCopy.textContent = won ? 'Board cleared.' : 'Try a different gravity route.';
    this.overlay.classList.add('visible');
  }

  reset(moves: number) {
    this.setMoves(moves);
    this.direction.textContent = 'GRAVITY ↓';
    this.gravityDot.style.transform = 'translateX(0)';
    this.overlay.classList.remove('visible');
  }
}
