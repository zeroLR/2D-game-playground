import { describe, expect, it } from 'vitest';
import { GameEventQueue } from '../src/domain/events';
import { createInitialState } from '../src/domain/gameState';
import { CollisionSystem } from '../src/systems/CollisionSystem';
import { WorldLifecycleSystem } from '../src/systems/WorldLifecycleSystem';
import { WorldGenerator, type WorldBand } from '../src/world/WorldGenerator';
import { WorldState, type WorldEntity } from '../src/world/WorldState';
import type { WorldRenderer } from '../src/presentation/WorldRenderer';

function rendererStub() {
  return { mount() {}, clear() {} } as unknown as WorldRenderer;
}

function encounterGroups(generator: WorldGenerator, count: number) {
  const bands = Array.from({ length: count }, () => generator.nextBand());
  const groups: WorldBand[][] = [];
  for (let index = 0; index < bands.length; index += 4) groups.push(bands.slice(index, index + 4));
  return groups;
}

describe('M6.3 traversal threats', () => {
  it('Pulse Gate alternates between lane-denial and safe timing windows', () => {
    const lifecycle = new WorldLifecycleSystem(rendererStub());
    const gate = lifecycle.state.addSpawn({ type: 'pulse-gate', x: 180, y: 400, height: 110, phase: 0 });
    expect(gate.type).toBe('pulse-gate');

    lifecycle.updateMotion(0, 180, 400, 1 / 60);
    expect(lifecycle.state.pulseGates[0].active).toBe(true);

    lifecycle.updateMotion(1.6, 180, 400, 1 / 60);
    expect(lifecycle.state.pulseGates[0].active).toBe(false);
  });

  it('Interceptor tracks player horizontally only while the player is near its vertical zone', () => {
    const lifecycle = new WorldLifecycleSystem(rendererStub());
    lifecycle.state.addSpawn({ type: 'interceptor', x: 82, y: 400, phase: 0 });

    lifecycle.updateMotion(0, 278, 410, 0.1);
    const trackingX = lifecycle.state.interceptors[0].x;
    expect(trackingX).toBeGreaterThan(82);

    lifecycle.updateMotion(0.1, 278, 700, 0.1);
    expect(lifecycle.state.interceptors[0].x).toBeLessThan(trackingX);
  });

  it('active Pulse Gate damages while an inactive Gate is passable', () => {
    const collision = new CollisionSystem();
    const events = new GameEventQueue();
    const activeWorld = new WorldState();
    activeWorld.addSpawn({ type: 'pulse-gate', x: 180, y: 500, height: 110, phase: 0 });
    activeWorld.pulseGates[0].active = true;
    const state = { ...createInitialState(), playerX: 180, playerY: 500, velocityY: -20 };

    const hit = collision.update(state, state.playerY, activeWorld, 0, 0, events);
    expect(hit.state.hp).toBe(state.hp - 1);

    const safeWorld = new WorldState();
    safeWorld.addSpawn({ type: 'pulse-gate', x: 180, y: 500, height: 110, phase: 0 });
    safeWorld.pulseGates[0].active = false;
    const safe = collision.update(state, state.playerY, safeWorld, 0, 0, new GameEventQueue());
    expect(safe.state.hp).toBe(state.hp);
  });

  it('Dash can destroy an Interceptor and preserve enemy-kill build interactions', () => {
    const world = new WorldState();
    const interceptor = world.addSpawn({ type: 'interceptor', x: 180, y: 500, phase: 0 });
    const state = { ...createInitialState(), playerX: 180, playerY: 500, dashTime: 0.1, dashReady: false, flow: 1 };
    const result = new CollisionSystem().update(state, state.playerY, world, 0, 0, new GameEventQueue());
    expect(interceptor).toMatchObject({ type: 'interceptor', destroyed: true });
    expect(result.state.flow).toBeGreaterThan(state.flow);
  });

  it('Elite composes timing, pursuit, and patrol roles', () => {
    const generator = new WorldGenerator(123);
    generator.queueRoute('elite');
    const group = Array.from({ length: 4 }, () => generator.nextBand());
    const spawns = group.flatMap((band) => band.spawns);
    expect(spawns.some((spawn) => spawn.type === 'pulse-gate')).toBe(true);
    expect(spawns.some((spawn) => spawn.type === 'interceptor')).toBe(true);
    expect(spawns.some((spawn) => spawn.type === 'drone')).toBe(true);
  });

  it('Climax eventually combines Pulse Gate and Interceptor without removing its recovery exit', () => {
    const groups = encounterGroups(new WorldGenerator(20260815), 1200);
    const climax = groups.find((group) => group[0]?.encounter === 'climax');
    expect(climax).toBeDefined();
    const spawns = (climax ?? []).flatMap((band) => band.spawns);
    expect(spawns.some((spawn) => spawn.type === 'pulse-gate')).toBe(true);
    expect(spawns.some((spawn) => spawn.type === 'interceptor')).toBe(true);
    expect(climax?.[3].rest).toBe(true);
    expect(climax?.[3].spawns.some((spawn) => spawn.type === 'crystal')).toBe(true);
  });
});
