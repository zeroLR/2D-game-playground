import { describe, expect, it } from 'vitest';
import type { TargetState } from '../src/game/TargetSystem';
import {
  FUSE_ZONE_DELAY_T1_SECONDS,
  FUSE_ZONE_DELAY_T2_SECONDS,
  FUSE_ZONE_RADIUS_T1,
  FUSE_ZONE_RADIUS_T2,
  FUSE_ZONE_TARGET_LIMIT_T1,
  FUSE_ZONE_TARGET_LIMIT_T2,
  RELAY_HOP_CADENCE_SECONDS,
  buildChainResolutionTimeline,
  selectDetonationZoneTargetIds,
} from '../src/progression/ChainResolutionTimeline';
import type { ChainPropagationPlan } from '../src/progression/ChainEvolutionTuning';

function target(id: number, x: number, y: number): TargetState {
  return { id, kind: 'crystal', position: { x, y }, radius: 16, hp: 1, maxHp: 1 };
}

function basePlan(): ChainPropagationPlan {
  return {
    mode: 'base',
    routeTargetIds: [2, 3],
    forkTargetIds: [],
    terminalTargetIds: [],
    allTargetIds: [2, 3],
    links: [
      { from: { x: 0, y: 0 }, to: { x: 10, y: 0 }, targetId: 2, kind: 'route' },
      { from: { x: 0, y: 0 }, to: { x: 20, y: 0 }, targetId: 3, kind: 'route' },
    ],
    terminalCenter: null,
    terminalRadius: 0,
    qualificationCount: 2,
  };
}

describe('ChainResolutionTimeline', () => {
  it('keeps Base Chain synchronous', () => {
    const timeline = buildChainResolutionTimeline(basePlan(), 0);
    expect(timeline.immediateTargetIds).toEqual([2, 3]);
    expect(timeline.relayActions).toEqual([]);
    expect(timeline.detonationZones).toEqual([]);
  });

  it('turns Relay links into a visible sequential crawl', () => {
    const plan = basePlan();
    plan.mode = 'relay';
    plan.links[1] = { ...plan.links[1], from: { x: 10, y: 0 }, kind: 'fork' };

    const timeline = buildChainResolutionTimeline(plan, 2);
    expect(timeline.immediateTargetIds).toEqual([]);
    expect(timeline.relayActions.map((action) => action.delaySeconds)).toEqual([
      RELAY_HOP_CADENCE_SECONDS,
      RELAY_HOP_CADENCE_SECONDS * 2,
    ]);
    expect(timeline.relayActions.map((action) => action.kind)).toEqual(['route', 'fork']);
    expect(timeline.detonationZones).toEqual([]);
  });

  it('turns every Detonation route node into a delayed world-space zone', () => {
    const plan = basePlan();
    plan.mode = 'detonation';
    plan.routeTargetIds = [2, 3, 4];
    plan.allTargetIds = [2, 3, 4];
    plan.links = [
      { from: { x: 0, y: 0 }, to: { x: 10, y: 0 }, targetId: 2, kind: 'route' },
      { from: { x: 10, y: 0 }, to: { x: 40, y: 20 }, targetId: 3, kind: 'route' },
      { from: { x: 40, y: 20 }, to: { x: 80, y: 24 }, targetId: 4, kind: 'route' },
    ];

    const tierOne = buildChainResolutionTimeline(plan, 1);
    const tierTwo = buildChainResolutionTimeline(plan, 2);

    expect(tierOne.immediateTargetIds).toEqual([]);
    expect(tierOne.relayActions).toEqual([]);
    expect(tierOne.detonationZones).toHaveLength(3);
    expect(tierOne.detonationZones[1]).toEqual({
      delaySeconds: FUSE_ZONE_DELAY_T1_SECONDS,
      center: { x: 40, y: 20 },
      radius: FUSE_ZONE_RADIUS_T1,
      targetLimit: FUSE_ZONE_TARGET_LIMIT_T1,
    });
    expect(tierTwo.detonationZones[0]).toMatchObject({
      delaySeconds: FUSE_ZONE_DELAY_T2_SECONDS,
      radius: FUSE_ZONE_RADIUS_T2,
      targetLimit: FUSE_ZONE_TARGET_LIMIT_T2,
    });
    expect(FUSE_ZONE_RADIUS_T2).toBeGreaterThan(FUSE_ZONE_RADIUS_T1);
  });

  it('selects targets from the live zone snapshot instead of preplanned route ids', () => {
    const ids = selectDetonationZoneTargetIds(
      { x: 100, y: 100 },
      50,
      2,
      [
        target(7, 118, 100),
        target(2, 92, 100),
        target(9, 180, 100),
        target(4, 130, 100),
      ],
    );

    expect(ids).toEqual([2, 7]);
  });
});
