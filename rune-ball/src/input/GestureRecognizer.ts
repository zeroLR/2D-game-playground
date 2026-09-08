import type { RuneKind } from '../rune/RuneTypes';
import { classifyDirectionalSwipe, type Point2D, type SwipeDirection } from './SwipeClassifier';

export type GestureIntent =
  | { type: 'swipe'; direction: SwipeDirection }
  | { type: 'rune'; rune: RuneKind; center: Point2D; confidence: number }
  | { type: 'failed-rune'; center: Point2D }
  | { type: 'none' };

const MIN_RUNE_PATH_LENGTH = 86;
const TEMPLATE_SAMPLE_COUNT = 28;
const V_TEMPLATE = resamplePath([
  { x: 0, y: 0 },
  { x: 0.5, y: 1 },
  { x: 1, y: 0 },
], TEMPLATE_SAMPLE_COUNT);
const Z_TEMPLATE = resamplePath([
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
], TEMPLATE_SAMPLE_COUNT);

export function classifyGesturePath(path: Point2D[]): GestureIntent {
  const clean = sanitizePath(path);
  if (clean.length < 2) return { type: 'none' };

  const length = pathLength(clean);
  const start = clean[0];
  const end = clean[clean.length - 1];
  const directDistance = distance(start, end);
  const directness = length > 0 ? directDistance / length : 1;
  const simplified = simplifyGesturePath(clean, 8);
  const turn = accumulatedTurn(simplified);
  const runeCandidate = length >= MIN_RUNE_PATH_LENGTH && (directness < 0.82 || turn > 1.2);

  if (runeCandidate) {
    const rune = recognizeRune(clean, length, directDistance, turn);
    if (rune) return rune;
    return { type: 'failed-rune', center: gestureCenter(clean) };
  }

  const swipe = classifyDirectionalSwipe(start, end);
  return swipe ? { type: 'swipe', direction: swipe.direction } : { type: 'none' };
}

export function simplifyGesturePath(path: Point2D[], tolerance = 8): Point2D[] {
  const clean = sanitizePath(path);
  if (clean.length <= 2) return clean;

  const first = clean[0];
  const last = clean[clean.length - 1];
  let maxDistance = 0;
  let splitIndex = -1;

  for (let index = 1; index < clean.length - 1; index += 1) {
    const currentDistance = perpendicularDistance(clean[index], first, last);
    if (currentDistance <= maxDistance) continue;
    maxDistance = currentDistance;
    splitIndex = index;
  }

  if (maxDistance <= tolerance || splitIndex < 0) return [first, last];

  const left = simplifyGesturePath(clean.slice(0, splitIndex + 1), tolerance);
  const right = simplifyGesturePath(clean.slice(splitIndex), tolerance);
  return [...left.slice(0, -1), ...right];
}

export function normalizeGesturePath(path: Point2D[], sampleCount = TEMPLATE_SAMPLE_COUNT): Point2D[] {
  const clean = sanitizePath(path);
  if (clean.length === 0) return [];
  const sampled = resamplePath(clean, sampleCount);
  const minX = Math.min(...sampled.map((point) => point.x));
  const maxX = Math.max(...sampled.map((point) => point.x));
  const minY = Math.min(...sampled.map((point) => point.y));
  const maxY = Math.max(...sampled.map((point) => point.y));
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);

  return sampled.map((point) => ({
    x: (point.x - minX) / width,
    y: (point.y - minY) / height,
  }));
}

function recognizeRune(
  path: Point2D[],
  length: number,
  directDistance: number,
  turn: number,
): Extract<GestureIntent, { type: 'rune' }> | null {
  const center = gestureCenter(path);
  const bounds = pathBounds(path);
  const diagonal = Math.hypot(bounds.width, bounds.height);
  if (!(diagonal > 0)) return null;

  const closedness = directDistance / diagonal;
  const aspect = bounds.width / Math.max(1, bounds.height);
  const circumferenceRatio = length / diagonal;

  if (
    closedness < 0.36
    && aspect > 0.55
    && aspect < 1.8
    && circumferenceRatio > 2.0
    && turn > 4.2
  ) {
    const confidence = clamp01(
      0.45
      + (0.36 - closedness) * 0.8
      + (Math.min(turn, Math.PI * 2) / (Math.PI * 2)) * 0.25,
    );
    return { type: 'rune', rune: 'vortex', center, confidence };
  }

  if (bounds.width < 44 || bounds.height < 44) return null;
  const normalized = normalizeGesturePath(path);

  const vScore = Math.min(
    templateDistance(normalized, V_TEMPLATE),
    templateDistance(normalized, [...V_TEMPLATE].reverse()),
  );
  if (vScore <= 0.235) {
    return { type: 'rune', rune: 'split', center, confidence: clamp01(1 - vScore / 0.3) };
  }

  const zScore = Math.min(
    templateDistance(normalized, Z_TEMPLATE),
    templateDistance(normalized, [...Z_TEMPLATE].reverse()),
  );
  if (zScore <= 0.24) {
    return { type: 'rune', rune: 'chain', center, confidence: clamp01(1 - zScore / 0.31) };
  }

  return null;
}

function sanitizePath(path: Point2D[]): Point2D[] {
  const clean: Point2D[] = [];
  for (const point of path) {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;
    const previous = clean[clean.length - 1];
    if (previous && distance(previous, point) < 0.5) continue;
    clean.push({ x: point.x, y: point.y });
  }
  return clean;
}

function resamplePath(path: Point2D[], count: number): Point2D[] {
  if (path.length === 0 || count <= 0) return [];
  if (path.length === 1 || count === 1) return [{ ...path[0] }];

  const cumulative = [0];
  for (let index = 1; index < path.length; index += 1) {
    cumulative.push(cumulative[index - 1] + distance(path[index - 1], path[index]));
  }
  const total = cumulative[cumulative.length - 1];
  if (!(total > 0)) return Array.from({ length: count }, () => ({ ...path[0] }));

  const result: Point2D[] = [];
  let segment = 1;
  for (let sample = 0; sample < count; sample += 1) {
    const targetDistance = total * (sample / (count - 1));
    while (segment < cumulative.length - 1 && cumulative[segment] < targetDistance) segment += 1;
    const beforeDistance = cumulative[segment - 1];
    const afterDistance = cumulative[segment];
    const span = Math.max(0.0001, afterDistance - beforeDistance);
    const t = clamp01((targetDistance - beforeDistance) / span);
    const before = path[segment - 1];
    const after = path[segment];
    result.push({
      x: before.x + (after.x - before.x) * t,
      y: before.y + (after.y - before.y) * t,
    });
  }
  return result;
}

function templateDistance(path: Point2D[], template: Point2D[]): number {
  if (path.length !== template.length || path.length === 0) return Number.POSITIVE_INFINITY;
  let total = 0;
  for (let index = 0; index < path.length; index += 1) {
    total += distance(path[index], template[index]);
  }
  return total / path.length;
}

function pathBounds(path: Point2D[]): { width: number; height: number } {
  const xs = path.map((point) => point.x);
  const ys = path.map((point) => point.y);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

function gestureCenter(path: Point2D[]): Point2D {
  const sum = path.reduce((accumulator, point) => ({
    x: accumulator.x + point.x,
    y: accumulator.y + point.y,
  }), { x: 0, y: 0 });
  return { x: sum.x / path.length, y: sum.y / path.length };
}

function pathLength(path: Point2D[]): number {
  let total = 0;
  for (let index = 1; index < path.length; index += 1) total += distance(path[index - 1], path[index]);
  return total;
}

function accumulatedTurn(path: Point2D[]): number {
  if (path.length < 3) return 0;
  let total = 0;
  let previousAngle = Math.atan2(path[1].y - path[0].y, path[1].x - path[0].x);
  for (let index = 2; index < path.length; index += 1) {
    const angle = Math.atan2(path[index].y - path[index - 1].y, path[index].x - path[index - 1].x);
    let delta = angle - previousAngle;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    total += Math.abs(delta);
    previousAngle = angle;
  }
  return total;
}

function perpendicularDistance(point: Point2D, lineStart: Point2D, lineEnd: Point2D): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!(lengthSquared > 0)) return distance(point, lineStart);
  const t = clamp01(((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lengthSquared);
  return distance(point, { x: lineStart.x + dx * t, y: lineStart.y + dy * t });
}

function distance(a: Point2D, b: Point2D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
