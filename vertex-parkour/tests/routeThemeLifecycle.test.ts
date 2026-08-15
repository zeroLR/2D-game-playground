import { describe, expect, it } from 'vitest';
import type { WorldRenderer } from '../src/presentation/WorldRenderer';
import { WorldLifecycleSystem } from '../src/systems/WorldLifecycleSystem';
import type { WorldEntity } from '../src/world/WorldState';

function createRendererStub() {
  const mounted: WorldEntity[] = [];
  const renderer = {
    mount(entity: WorldEntity) { mounted.push(entity); },
    clear() { mounted.length = 0; },
  } as unknown as WorldRenderer;
  return { renderer, mounted };
}

describe('persistent route theme lifecycle', () => {
  it('stops world pre-generation at a route choice and themes newly generated platforms after selection', () => {
    const { renderer } = createRendererStub();
    const lifecycle = new WorldLifecycleSystem(renderer);
    lifecycle.seedInitialWorld();

    lifecycle.update(10_000);

    expect(lifecycle.state.routes).toHaveLength(2);
    const choicePlatforms = lifecycle.state.platforms.filter((platform) =>
      lifecycle.state.routes.some((route) => Math.abs(route.x - platform.x) < 40 && Math.abs(route.y + 48 - platform.y) < 8),
    );
    expect(choicePlatforms.length).toBeGreaterThan(0);
    expect(choicePlatforms.every((platform) => platform.routeTheme === null)).toBe(true);

    const selected = lifecycle.state.routes[0];
    const platformCountAtChoice = lifecycle.state.platforms.length;
    const oldPlatformIds = new Set(lifecycle.state.platforms.map((platform) => platform.id));
    lifecycle.state.commitRouteChoice(selected.choiceId, selected.id);

    lifecycle.update(10_000);

    const newlyGenerated = lifecycle.state.platforms.slice(platformCountAtChoice);
    expect(newlyGenerated.some((platform) => platform.routeTheme === selected.kind)).toBe(true);
    expect(lifecycle.state.getActiveRoute()).toBe(selected.kind);
    expect(lifecycle.state.platforms.filter((platform) => oldPlatformIds.has(platform.id)).every((platform) => platform.routeTheme === null)).toBe(true);
  });
});
