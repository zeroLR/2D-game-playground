import { describe, expect, it } from 'vitest';
import { FlowSystem } from '../src/progression/FlowSystem';

describe('FlowSystem', () => {
  it('builds Flow from meaningful offense and enters Overdrive at the threshold', () => {
    const flow = new FlowSystem();
    expect(flow.snapshot.ratio).toBe(0);

    let entered = false;
    for (let index = 0; index < 20 && !entered; index += 1) {
      entered = flow.registerImpact(true);
    }

    expect(entered).toBe(true);
    expect(flow.snapshot.overdriveActive).toBe(true);
    expect(flow.snapshot.value).toBe(flow.snapshot.threshold);
    expect(flow.snapshot.presentationIntensity).toBe(1);
  });

  it('uses Rune and Chain setup as secondary Flow sources', () => {
    const flow = new FlowSystem();
    flow.registerRune();
    flow.registerChain(3);
    expect(flow.snapshot.value).toBeCloseTo(8.5);
  });

  it('keeps Overdrive active for twelve seconds and exits deterministically', () => {
    const flow = new FlowSystem();
    for (let index = 0; index < 20 && !flow.snapshot.overdriveActive; index += 1) flow.registerImpact(true);

    expect(flow.snapshot.overdriveDuration).toBe(12);
    expect(flow.update(11.9)).toBe(false);
    expect(flow.snapshot.overdriveActive).toBe(true);
    expect(flow.update(0.11)).toBe(true);
    expect(flow.snapshot.overdriveActive).toBe(false);
    expect(flow.snapshot.value).toBe(0);
  });

  it('allows only one Overdrive climax per mechanic-gate session', () => {
    const flow = new FlowSystem();
    for (let index = 0; index < 20 && !flow.snapshot.overdriveActive; index += 1) flow.registerImpact(true);
    flow.update(12.1);

    for (let index = 0; index < 100; index += 1) {
      expect(flow.registerImpact(true)).toBe(false);
      flow.registerRune();
      flow.registerChain(3);
    }

    expect(flow.snapshot.overdriveUsed).toBe(true);
    expect(flow.snapshot.overdriveActive).toBe(false);
    expect(flow.snapshot.value).toBe(0);
  });
});
