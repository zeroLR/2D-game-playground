import type { Point2D } from './SwipeClassifier';

const MIN_SAMPLE_DISTANCE = 5;
const MAX_SAMPLES = 96;

export class PointerPathSampler {
  private points: Point2D[] = [];

  get snapshot(): Point2D[] {
    return this.points.map((point) => ({ ...point }));
  }

  begin(point: Point2D): void {
    this.points = [{ ...point }];
  }

  add(point: Point2D): void {
    if (this.points.length === 0) {
      this.begin(point);
      return;
    }

    const previous = this.points[this.points.length - 1];
    if (Math.hypot(point.x - previous.x, point.y - previous.y) < MIN_SAMPLE_DISTANCE) return;

    if (this.points.length >= MAX_SAMPLES) {
      this.points.splice(1, 1);
    }
    this.points.push({ ...point });
  }

  finish(point: Point2D): Point2D[] {
    this.add(point);
    const path = this.snapshot;
    this.clear();
    return path;
  }

  clear(): void {
    this.points = [];
  }
}
