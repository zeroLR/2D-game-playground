import { SKILLS, type SkillId } from '../domain/skills';

export const START_PLATFORM_Y = 602;
export const REGULAR_GAP_MIN = 72;
export const REGULAR_GAP_MAX = 90;
export const REST_GAP_MIN = 88;
export const REST_GAP_MAX = 104;

const LANES = [82, 180, 278] as const;
const SPIKE_WIDTH = 18;
const SPIKE_EDGE_INSET = 5;
const ENCOUNTER_LENGTH = 4;
const SKILL_CHOICE_INTERVAL = 3;
const ROUTE_CHOICE_INTERVAL = 5;

export type Lane = (typeof LANES)[number];
export type RouteKind = 'treasure' | 'elite' | 'rest' | 'skill';
export type EncounterType = 'recovery' | 'dash-chain' | 'edge-read' | 'wall-rescue' | 'moving-window' | 'upgrade-choice' | 'route-choice' | 'treasure' | 'elite' | 'rest-route';
export type PlatformMotion = { axis: 'x'; amplitude: number; speed: number; phase: number; originX: number };
export type UpgradeKind = 'dash' | 'flow';

export type PlatformSpawn = { type: 'platform'; x: number; y: number; width: number; motion?: PlatformMotion };
export type CrystalSpawn = { type: 'crystal'; x: number; y: number };
export type DroneSpawn = { type: 'drone'; x: number; y: number; phase: number };
export type HazardSpawn = { type: 'hazard'; x: number; y: number };
export type SpikeSpawn = { type: 'spike'; x: number; y: number; width: number };
export type WallSpawn = { type: 'wall'; side: -1 | 1; y: number; height: number };
export type UpgradeSpawn = { type: 'upgrade'; x: number; y: number; kind: UpgradeKind; skillId?: SkillId; choiceId: number };
export type RouteSpawn = { type: 'route'; x: number; y: number; kind: RouteKind; choiceId: number };
export type WorldSpawn = PlatformSpawn | CrystalSpawn | DroneSpawn | HazardSpawn | SpikeSpawn | WallSpawn | UpgradeSpawn | RouteSpawn;
export type WorldBand = { index: number; y: number; rest: boolean; encounter: EncounterType; encounterStep: number; spawns: WorldSpawn[] };
type BandPlan = { rest?: boolean; lane: Lane; width: number; decorate?: (y: number) => WorldSpawn[] };

export function createRunSeed(): number { return Math.floor(Math.random() * 0x1_0000_0000) >>> 0; }

export class SeededRandom {
  private state: number;
  constructor(seed: number) { this.state = seed >>> 0; }
  next(): number { let t = (this.state += 0x6d2b79f5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 0x1_0000_0000; }
}

export class WorldGenerator {
  private bandIndex = 0;
  private lastY = START_PLATFORM_Y;
  private previousPlatformLane: Lane = 180;
  private encounterType: EncounterType = 'recovery';
  private encounterStep = ENCOUNTER_LENGTH;
  private encounterPlans: BandPlan[] = [];
  private encountersSinceSkill = 0;
  private encountersSinceRoute = 0;
  private choiceId = 0;
  private queuedRoute: RouteKind | null = null;
  private readonly random: SeededRandom;

  constructor(readonly seed: number) { this.random = new SeededRandom(seed); }
  getLastY() { return this.lastY; }
  queueRoute(kind: RouteKind) { this.queuedRoute = kind; }
  reset() { this.bandIndex = 0; this.lastY = START_PLATFORM_Y; this.previousPlatformLane = 180; this.encounterType = 'recovery'; this.encounterStep = ENCOUNTER_LENGTH; this.encounterPlans = []; this.encountersSinceSkill = 0; this.encountersSinceRoute = 0; this.choiceId = 0; this.queuedRoute = null; }

  nextBand(): WorldBand {
    if (this.encounterStep >= this.encounterPlans.length) this.startEncounter();
    const plan = this.encounterPlans[this.encounterStep];
    const step = this.encounterStep++;
    this.bandIndex += 1;
    const rest = plan.rest === true;
    this.lastY -= rest ? this.between(REST_GAP_MIN, REST_GAP_MAX) : this.between(REGULAR_GAP_MIN, REGULAR_GAP_MAX);
    const spawns: WorldSpawn[] = [{ type: 'platform', x: plan.lane, y: this.lastY, width: plan.width }];
    if (plan.decorate) spawns.push(...plan.decorate(this.lastY));
    this.previousPlatformLane = plan.lane;
    return { index: this.bandIndex, y: this.lastY, rest, encounter: this.encounterType, encounterStep: step, spawns };
  }

  private startEncounter() {
    if (this.queuedRoute) {
      const route = this.queuedRoute; this.queuedRoute = null;
      this.encounterType = route === 'skill' ? 'upgrade-choice' : route === 'rest' ? 'rest-route' : route;
      if (this.encounterType === 'upgrade-choice') this.choiceId += 1;
    } else if (this.encountersSinceRoute >= ROUTE_CHOICE_INTERVAL) {
      this.encounterType = 'route-choice'; this.encountersSinceRoute = 0; this.choiceId += 1;
    } else if (this.encountersSinceSkill >= SKILL_CHOICE_INTERVAL) {
      this.encounterType = 'upgrade-choice'; this.encountersSinceSkill = 0; this.encountersSinceRoute += 1; this.choiceId += 1;
    } else {
      const roll = this.random.next();
      this.encounterType = roll < 0.23 ? 'recovery' : roll < 0.45 ? 'dash-chain' : roll < 0.65 ? 'edge-read' : roll < 0.83 ? 'wall-rescue' : 'moving-window';
      this.encountersSinceSkill += 1; this.encountersSinceRoute += 1;
    }
    this.encounterPlans = this.buildEncounter(this.encounterType); this.encounterStep = 0;
  }

  private buildEncounter(type: EncounterType): BandPlan[] {
    switch (type) {
      case 'recovery': return this.buildRecovery();
      case 'dash-chain': return this.buildDashChain();
      case 'edge-read': return this.buildEdgeRead();
      case 'wall-rescue': return this.buildWallRescue();
      case 'moving-window': return this.buildMovingWindow();
      case 'upgrade-choice': return this.buildUpgradeChoice();
      case 'route-choice': return this.buildRouteChoice();
      case 'treasure': return this.buildTreasure();
      case 'elite': return this.buildElite();
      case 'rest-route': return this.buildRestRoute();
    }
  }

  private buildRecovery(): BandPlan[] { const adjacent = this.towardCenterOrAdjacent(this.previousPlatformLane); return [{ lane: adjacent, width: 102 }, { lane: 180, width: 108, decorate: (y) => [{ type: 'crystal', x: 180, y: y - 46 }] }, { lane: this.pick([82, 278] as const), width: 104 }, { lane: 180, width: 112, rest: true }]; }
  private buildDashChain(): BandPlan[] { const side: -1 | 1 = this.random.next() < 0.5 ? -1 : 1; const entry: Lane = side === -1 ? 82 : 278; const exit: Lane = side === -1 ? 278 : 82; return [{ lane: entry, width: 106 }, { lane: 180, width: 100, decorate: (y) => [{ type: 'drone', x: exit, y: y - 38, phase: this.random.next() * Math.PI * 2 }] }, { lane: exit, width: 108, decorate: (y) => [{ type: 'crystal', x: exit, y: y - 46 }] }, { lane: 180, width: 112, rest: true }]; }
  private buildEdgeRead(): BandPlan[] { const approach = this.previousPlatformLane; const target: Lane = approach === 82 ? 180 : approach === 278 ? 180 : this.pick([82, 278] as const); const direction = Math.sign(target - approach) || (target < 180 ? -1 : 1); const width = 110; const edgeOffset = width / 2 - SPIKE_WIDTH / 2 - SPIKE_EDGE_INSET; const safeExit: Lane = direction > 0 ? 82 : 278; return [{ lane: target, width, decorate: (y) => [{ type: 'spike', x: target + direction * edgeOffset, y: y - 10, width: SPIKE_WIDTH }] }, { lane: safeExit, width: 104 }, { lane: 180, width: 106, decorate: (y) => [{ type: 'crystal', x: 180, y: y - 46 }] }, { lane: 180, width: 112, rest: true }]; }
  private buildWallRescue(): BandPlan[] { const side: -1 | 1 = this.random.next() < 0.5 ? -1 : 1; const outer: Lane = side === -1 ? 82 : 278; const opposite: Lane = side === -1 ? 278 : 82; return [{ lane: outer, width: 102 }, { lane: opposite, width: 102, decorate: (y) => [{ type: 'wall', side, y: y - 42, height: 132 }] }, { lane: 180, width: 108, decorate: (y) => [{ type: 'crystal', x: 180, y: y - 46 }] }, { lane: 180, width: 112, rest: true }]; }
  private buildMovingWindow(): BandPlan[] { const side: -1 | 1 = this.random.next() < 0.5 ? -1 : 1; const safeLane: Lane = side === -1 ? 82 : 278; const rewardLane: Lane = side === -1 ? 278 : 82; const phase = this.random.next() * Math.PI * 2; return [{ lane: 180, width: 108 }, { lane: safeLane, width: 106, decorate: (y) => [{ type: 'platform', x: 180, y, width: 118, motion: { axis: 'x', amplitude: 46, speed: 0.9, phase, originX: 180 } }] }, { lane: rewardLane, width: 108, decorate: (y) => [{ type: 'crystal', x: rewardLane, y: y - 46 }] }, { lane: 180, width: 112, rest: true }]; }

  private buildUpgradeChoice(): BandPlan[] { const id = this.choiceId; const pair = this.pickSkillPair(); return [{ lane: 180, width: 118 }, { lane: 82, width: 108, decorate: (y) => [{ type: 'platform', x: 278, y, width: 108 }, { type: 'upgrade', x: 82, y: y - 46, kind: SKILLS[pair[0]].archetype === 'flow' ? 'flow' : 'dash', skillId: pair[0], choiceId: id }, { type: 'upgrade', x: 278, y: y - 46, kind: SKILLS[pair[1]].archetype === 'flow' ? 'flow' : 'dash', skillId: pair[1], choiceId: id }] }, { lane: 180, width: 116, decorate: (y) => [{ type: 'crystal', x: 180, y: y - 44 }] }, { lane: 180, width: 122, rest: true }]; }
  private buildRouteChoice(): BandPlan[] { const id = this.choiceId; const pair = this.pickRoutePair(); return [{ lane: 180, width: 120 }, { lane: 82, width: 112, decorate: (y) => [{ type: 'platform', x: 278, y, width: 112 }, { type: 'route', x: 82, y: y - 48, kind: pair[0], choiceId: id }, { type: 'route', x: 278, y: y - 48, kind: pair[1], choiceId: id }] }, { lane: 180, width: 120 }, { lane: 180, width: 126, rest: true }]; }
  private buildTreasure(): BandPlan[] { return [{ lane: 180, width: 118, decorate: (y) => [{ type: 'crystal', x: 150, y: y - 48 }, { type: 'crystal', x: 210, y: y - 48 }] }, { lane: 82, width: 112, decorate: (y) => [{ type: 'crystal', x: 82, y: y - 46 }] }, { lane: 278, width: 112, decorate: (y) => [{ type: 'crystal', x: 278, y: y - 46 }] }, { lane: 180, width: 126, rest: true }]; }
  private buildElite(): BandPlan[] { const side: -1 | 1 = this.random.next() < 0.5 ? -1 : 1; const first: Lane = side === -1 ? 82 : 278; const second: Lane = side === -1 ? 278 : 82; return [{ lane: first, width: 104, decorate: (y) => [{ type: 'drone', x: 180, y: y - 40, phase: this.random.next() * Math.PI * 2 }] }, { lane: second, width: 102, decorate: (y) => [{ type: 'hazard', x: 180, y: y - 38 }] }, { lane: 180, width: 108, decorate: (y) => [{ type: 'drone', x: second, y: y - 42, phase: this.random.next() * Math.PI * 2 }, { type: 'crystal', x: first, y: y - 46 }] }, { lane: 180, width: 118, rest: true }]; }
  private buildRestRoute(): BandPlan[] { return [{ lane: 180, width: 136, decorate: (y) => [{ type: 'crystal', x: 180, y: y - 46 }] }, { lane: 180, width: 142 }, { lane: 180, width: 142, decorate: (y) => [{ type: 'crystal', x: 180, y: y - 46 }] }, { lane: 180, width: 148, rest: true }]; }

  private pickSkillPair(): [SkillId, SkillId] { const ids = Object.keys(SKILLS) as SkillId[]; const firstIndex = Math.floor(this.random.next() * ids.length); let secondIndex = Math.floor(this.random.next() * (ids.length - 1)); if (secondIndex >= firstIndex) secondIndex += 1; return [ids[firstIndex], ids[secondIndex]]; }
  private pickRoutePair(): [RouteKind, RouteKind] { const routes: RouteKind[] = ['treasure', 'elite', 'rest', 'skill']; const firstIndex = Math.floor(this.random.next() * routes.length); let secondIndex = Math.floor(this.random.next() * (routes.length - 1)); if (secondIndex >= firstIndex) secondIndex += 1; return [routes[firstIndex], routes[secondIndex]]; }
  private towardCenterOrAdjacent(lane: Lane): Lane { return lane === 180 ? this.pick([82, 278] as const) : 180; }
  private between(min: number, max: number) { return min + this.random.next() * (max - min); }
  private pick<T>(items: readonly T[]): T { return items[Math.floor(this.random.next() * items.length)]; }
}
