// ── Multi-stage wave definitions ────────────────────────────────────────────
// Stage 1 reuses the original 8-wave set. Stages 2 & 3 increase difficulty,
// introduce the new enemy types, and have different compositions. Each stage
// is still an 8-wave structure ending in a boss.

import type { WaveSpec } from "./waves";

export type { WaveSpec };

// Stage 1 — "White Grid" (original)
const STAGE_1: readonly WaveSpec[] = [
  { index: 1, durationHint: 20, groups: [
    { t: 0.5, kind: "circle", count: 3 },
    { t: 6,   kind: "circle", count: 4 },
    { t: 12,  kind: "circle", count: 5 },
  ] },
  { index: 2, durationHint: 22, groups: [
    { t: 0.5, kind: "circle", count: 5 },
    { t: 7,   kind: "circle", count: 6 },
    { t: 14,  kind: "square", count: 2 },
  ] },
  { index: 3, durationHint: 24, groups: [
    { t: 0.5, kind: "circle", count: 4 },
    { t: 5,   kind: "square", count: 3 },
    { t: 12,  kind: "circle", count: 6 },
    { t: 18,  kind: "square", count: 3 },
  ] },
  { index: 4, durationHint: 26, groups: [
    { t: 0.5, kind: "square", count: 4 },
    { t: 7,   kind: "circle", count: 6 },
    { t: 14,  kind: "square", count: 4 },
    { t: 20,  kind: "circle", count: 5 },
  ] },
  { index: 5, durationHint: 28, groups: [
    { t: 0.5, kind: "circle", count: 6 },
    { t: 6,   kind: "star",   count: 1 },
    { t: 14,  kind: "square", count: 5 },
    { t: 22,  kind: "star",   count: 2 },
  ] },
  { index: 6, durationHint: 32, groups: [
    { t: 0.5, kind: "square", count: 5 },
    { t: 6,   kind: "circle", count: 8 },
    { t: 14,  kind: "star",   count: 3 },
    { t: 22,  kind: "square", count: 6 },
  ] },
  { index: 7, durationHint: 36, groups: [
    { t: 0.5, kind: "star",   count: 2 },
    { t: 5,   kind: "circle", count: 8 },
    { t: 12,  kind: "square", count: 6 },
    { t: 20,  kind: "star",   count: 4 },
    { t: 28,  kind: "circle", count: 8 },
  ] },
  { index: 8, durationHint: 60, groups: [
    { t: 0.5, kind: "boss", count: 1 },
  ] },
];

// Stage 2 — "Deep Blue" (adds pentagon & diamond)
const STAGE_2: readonly WaveSpec[] = [
  { index: 1, durationHint: 20, groups: [
    { t: 0.5, kind: "circle", count: 4 },
    { t: 6,   kind: "square", count: 3 },
    { t: 12,  kind: "circle", count: 5 },
  ] },
  { index: 2, durationHint: 22, groups: [
    { t: 0.5, kind: "square", count: 4 },
    { t: 7,   kind: "pentagon", count: 2 },
    { t: 14,  kind: "circle", count: 6 },
  ] },
  { index: 3, durationHint: 24, groups: [
    { t: 0.5, kind: "pentagon", count: 2 },
    { t: 5,   kind: "diamond", count: 2 },
    { t: 12,  kind: "square", count: 5 },
    { t: 18,  kind: "circle", count: 6 },
  ] },
  { index: 4, durationHint: 26, groups: [
    { t: 0.5, kind: "diamond", count: 3 },
    { t: 7,   kind: "star",   count: 2 },
    { t: 14,  kind: "pentagon", count: 3 },
    { t: 20,  kind: "square", count: 5 },
  ] },
  { index: 5, durationHint: 28, groups: [
    { t: 0.5, kind: "star",    count: 2 },
    { t: 6,   kind: "hexagon", count: 1 },
    { t: 14,  kind: "diamond", count: 3 },
    { t: 22,  kind: "pentagon", count: 3 },
  ] },
  { index: 6, durationHint: 32, groups: [
    { t: 0.5, kind: "hexagon", count: 2 },
    { t: 6,   kind: "star",    count: 3 },
    { t: 14,  kind: "diamond", count: 4 },
    { t: 22,  kind: "pentagon", count: 4 },
  ] },
  { index: 7, durationHint: 36, groups: [
    { t: 0.5, kind: "diamond", count: 3 },
    { t: 5,   kind: "hexagon", count: 2 },
    { t: 12,  kind: "star",    count: 4 },
    { t: 20,  kind: "pentagon", count: 4 },
    { t: 28,  kind: "circle",  count: 10 },
  ] },
  { index: 8, durationHint: 60, groups: [
    { t: 0.5, kind: "boss", count: 1 },
  ] },
];

// Stage 3 — "Dark Core" (adds cross & crescent, hardest)
const STAGE_3: readonly WaveSpec[] = [
  { index: 1, durationHint: 20, groups: [
    { t: 0.5, kind: "square",  count: 4 },
    { t: 6,   kind: "diamond", count: 3 },
    { t: 12,  kind: "circle",  count: 6 },
  ] },
  { index: 2, durationHint: 22, groups: [
    { t: 0.5, kind: "pentagon", count: 3 },
    { t: 7,   kind: "cross",    count: 1 },
    { t: 14,  kind: "diamond",  count: 3 },
  ] },
  { index: 3, durationHint: 24, groups: [
    { t: 0.5, kind: "cross",    count: 2 },
    { t: 5,   kind: "crescent", count: 2 },
    { t: 12,  kind: "hexagon",  count: 2 },
    { t: 18,  kind: "star",     count: 3 },
  ] },
  { index: 4, durationHint: 26, groups: [
    { t: 0.5, kind: "crescent", count: 3 },
    { t: 7,   kind: "cross",    count: 2 },
    { t: 14,  kind: "diamond",  count: 4 },
    { t: 20,  kind: "hexagon",  count: 2 },
  ] },
  { index: 5, durationHint: 28, groups: [
    { t: 0.5, kind: "hexagon",  count: 3 },
    { t: 6,   kind: "cross",    count: 2 },
    { t: 14,  kind: "crescent", count: 3 },
    { t: 22,  kind: "star",     count: 4 },
  ] },
  { index: 6, durationHint: 32, groups: [
    { t: 0.5, kind: "cross",    count: 3 },
    { t: 6,   kind: "pentagon",  count: 4 },
    { t: 14,  kind: "crescent",  count: 4 },
    { t: 22,  kind: "diamond",   count: 5 },
  ] },
  { index: 7, durationHint: 36, groups: [
    { t: 0.5, kind: "crescent",  count: 3 },
    { t: 5,   kind: "cross",     count: 3 },
    { t: 12,  kind: "hexagon",   count: 3 },
    { t: 20,  kind: "star",      count: 5 },
    { t: 28,  kind: "diamond",   count: 5 },
  ] },
  { index: 8, durationHint: 60, groups: [
    { t: 0.5, kind: "boss", count: 1 },
  ] },
];

export const STAGE_WAVES: readonly (readonly WaveSpec[])[] = [STAGE_1, STAGE_2, STAGE_3];

/** Number of stages available in normal mode. */
export const STAGE_COUNT = STAGE_WAVES.length;
