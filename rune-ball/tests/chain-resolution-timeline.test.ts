import { describe, expect, it } from 'vitest';
import {
  FUSE_DETONATION_DELAY_T1_SECONDS,
  FUSE_DETONATION_DELAY_T2_SECONDS,
  RELAY_HOP_CADENCE_SECONDS,
  buildChainResolutionTimeline,
} from '../src/progression/ChainResolutionTimeline';
import type { ChainPropagationPlan } from '../src/progression/ChainEvolutionTuning';

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
    expect(timeline.detonation).toBeNull();
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
    expect(timeline.detonation).toBeNull();
  });

  it('turns Detonation into one delayed endpoint cash-out instead of route hits', () => {
    const plan = basePlan();
    plan.mode = 'detonation';
    plan.routeTargetIds = [2, 3, 4];
    plan.terminalTargetIds = [7, 8];
    plan.allTargetIds = [2, 3, 4, 7, 8];
    plan.terminalCenter = { x: 40, y: 20 };
    plan.terminalRadius = 88;

    const tierOne = buildChainResolutionTimeline(plan, 1);
    const tierTwo = buildChainResolutionTimeline(plan, 2);

    expect(tierOne.immediateTargetIds).toEqual([]);
    expect(tierOne.relayActions).toEqual([]);
    expect(tierOne.detonation).toMatchObject({
      delaySeconds: FUSE_DETONATION_DELAY_T1_SECONDS,
      center: { x: 40, y: 20 },
      radius: 88,
      targetIds: [4, 7, 8],
    });
    expect(tierTwo.detonation?.delaySeconds).toBe(FUSE_DETONATION_DELAY_T2_SECONDS);
  });
});
