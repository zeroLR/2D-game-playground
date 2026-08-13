export const START_PLATFORM_Y = 602;
export const REGULAR_GAP_MIN = 72;
export const REGULAR_GAP_MAX = 90;
export const REST_GAP_MIN = 88;
export const REST_GAP_MAX = 104;

const LANES = [82, 180, 278] as const;
const SPIKE_WIDTH = 18;
const SPIKE_EDGE_INSET = 5;
const MIN_SPIKE_PLATFORM_WIDTH = 102;

export type PlatformSpawn = { type: 'platform'; x: number; y: number; width: number };
export type CrystalSpawn = { type: 'crystal'; x: number; y: number };
export type DroneSpawn = { type: 'drone'; x: number; y: number; phase: number };
export type HazardSpawn = { type: 'hazard'; x: number; y: number };
export type SpikeSpawn = { type: 'spike'; x: number; y: number; width: number };
export type WallSpawn = { type: 'wall'; side: -1 | 1; y: number; height: number };
export type WorldSpawn = PlatformSpawn | CrystalSpawn | DroneSpawn | HazardSpawn | SpikeSpawn | WallSpawn;

export type WorldBand = {
  index: number;
  y: number;
  rest: boolean;
  spawns: WorldSpawn[];
};

export function createRunSeed(): number {
  return Math.floor(Math.random() * 0x1_0000_0000) >>> 0;
}

/** Small deterministic PRNG suitable for reproducible procedural level generation. */
export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 0x1_0000_0000;
  }
}

export class WorldGenerator {
  private bandIndex = 0;
  private lastY = START_PLATFORM_Y;
  private previousPlatformLane = 180;
  private readonly random: SeededRandom;

  constructor(readonly seed: number) {
    this.random = new SeededRandom(seed);
  }

  getLastY() {
    return this.lastY;
  }

  reset() {
    this.bandIndex = 0;
    this.lastY = START_PLATFORM_Y;
    this.previousPlatformLane = 180;
  }

  nextBand(): WorldBand {
    this.bandIndex += 1;
    const rest = this.bandIndex % 4 === 0;
    this.lastY -= rest
      ? this.between(REST_GAP_MIN, REST_GAP_MAX)
      : this.between(REGULAR_GAP_MIN, REGULAR_GAP_MAX);

    const previousLane = this.previousPlatformLane;
    const platformLane = this.pick(LANES);
    this.previousPlatformLane = platformLane;
    const platformWidth = rest ? 68 + this.random.next() * 20 : 74 + this.random.next() * 38;
    const spawns: WorldSpawn[] = [{
      type: 'platform',
      x: platformLane,
      y: this.lastY,
      width: platformWidth,
    }];

    if (rest) {
      if (this.random.next() < 0.42) {
        spawns.push({ type: 'crystal', x: platformLane, y: this.lastY - 46 });
      }
      return { index: this.bandIndex, y: this.lastY, rest, spawns };
    }

    const otherLanes = LANES.filter((lane) => lane !== platformLane);
    const routeLane = this.pick(otherLanes);

    if (this.bandIndex % 5 === 0) {
      spawns.push({ type: 'wall', side: routeLane < 180 ? -1 : 1, y: this.lastY - 42, height: 116 });
    } else if (this.random.next() < 0.34) {
      spawns.push({ type: 'drone', x: routeLane, y: this.lastY - 38, phase: this.random.next() * Math.PI * 2 });
    } else if (this.random.next() < 0.48) {
      spawns.push({ type: 'hazard', x: routeLane, y: this.lastY - 30 });
    }

    // Spikes are edge hazards: normal approach should naturally target the broad safe center.
    // The minimum platform width is derived from the 28px central safe-zone invariant.
    if (this.bandIndex % 5 !== 0 && platformWidth >= MIN_SPIKE_PLATFORM_WIDTH && this.random.next() < 0.24) {
      const approachDirection = Math.sign(platformLane - previousLane);
      const side: -1 | 1 = approachDirection === 0
        ? (this.random.next() < 0.5 ? -1 : 1)
        : (approachDirection as -1 | 1);
      const edgeOffset = platformWidth / 2 - SPIKE_WIDTH / 2 - SPIKE_EDGE_INSET;
      spawns.push({ type: 'spike', x: platformLane + side * edgeOffset, y: this.lastY - 10, width: SPIKE_WIDTH });
    }

    if (this.random.next() < 0.48) {
      spawns.push({ type: 'crystal', x: platformLane, y: this.lastY - 46 });
    }

    return { index: this.bandIndex, y: this.lastY, rest, spawns };
  }

  private between(min: number, max: number) {
    return min + this.random.next() * (max - min);
  }

  private pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.random.next() * items.length)];
  }
}
