import { describe, expect, it } from 'vitest';
import { RuneSystem } from '../src/rune/RuneSystem';

describe('RuneSystem', () => {
  it('starts charged enough to exercise the gesture gate and spends shared charge', () => {
    const runes = new RuneSystem();
    expect(runes.snapshot.charge).toBe(100);
    expect(runes.activate('vortex', { x: 100, y: 100 }).success).toBe(true);
    expect(runes.snapshot.charge).toBe(70);
    expect(runes.activate('split', { x: 120, y: 140 }).success).toBe(true);
    expect(runes.snapshot.charge).toBe(40);
    expect(runes.activate('chain', { x: 160, y: 180 }).success).toBe(true);
    expect(runes.snapshot.charge).toBe(10);
  });

  it('exposes temporary Vortex and Split states that decay without blocking play', () => {
    const runes = new RuneSystem();
    runes.activate('vortex', { x: 80, y: 90 });
    runes.activate('split', { x: 120, y: 130 });
    expect(runes.snapshot.vortexStrength).toBeGreaterThan(0.99);
    expect(runes.snapshot.splitStrength).toBeGreaterThan(0.99);

    runes.update(2);
    expect(runes.snapshot.vortexStrength).toBe(0);
    expect(runes.snapshot.vortexCenter).toBeNull();
    expect(runes.snapshot.splitStrength).toBe(0);
  });

  it('keeps Chain armed until the next impact consumes it', () => {
    const runes = new RuneSystem();
    expect(runes.activate('chain', { x: 0, y: 0 }).success).toBe(true);
    expect(runes.snapshot.chainReady).toBe(true);
    expect(runes.activate('chain', { x: 0, y: 0 })).toMatchObject({ success: false, reason: 'busy' });
    expect(runes.consumeChain()).toBe(true);
    expect(runes.snapshot.chainReady).toBe(false);
    expect(runes.consumeChain()).toBe(false);
  });

  it('recharges from meaningful impacts and clamps at the shared maximum', () => {
    const runes = new RuneSystem();
    runes.activate('vortex', { x: 0, y: 0 });
    runes.activate('split', { x: 0, y: 0 });
    expect(runes.snapshot.charge).toBe(40);

    runes.registerImpact(false);
    expect(runes.snapshot.charge).toBe(45);
    runes.registerImpact(true);
    expect(runes.snapshot.charge).toBe(61);
    for (let index = 0; index < 10; index += 1) runes.registerImpact(true);
    expect(runes.snapshot.charge).toBe(100);
  });

  it('makes Rune activations free during Overdrive without refilling charge', () => {
    const runes = new RuneSystem();
    runes.activate('vortex', { x: 0, y: 0 });
    runes.activate('split', { x: 0, y: 0 });
    runes.activate('chain', { x: 0, y: 0 });
    runes.consumeChain();
    expect(runes.snapshot.charge).toBe(10);

    runes.setOverdriveActive(true);
    expect(runes.snapshot.cost).toBe(0);
    expect(runes.activate('vortex', { x: 30, y: 30 }).success).toBe(true);
    expect(runes.activate('split', { x: 50, y: 50 }).success).toBe(true);
    expect(runes.activate('chain', { x: 70, y: 70 }).success).toBe(true);
    expect(runes.snapshot.charge).toBe(10);

    runes.setOverdriveActive(false);
    expect(runes.snapshot.cost).toBe(30);
  });
});
