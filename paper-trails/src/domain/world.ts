import {
  CARDINAL_DIRECTIONS,
  type AdjacencyGraph,
  type DefinitionRegistry,
  type Direction,
  type GridPosition,
  type LevelDefinition,
  type PageDefinition,
  type PageState,
  type WorldState,
  directionOffset,
  oppositeDirection,
  positionKey,
  rotateExits,
  rotateRotation,
} from './model';

export function createDefinitionRegistry(definitions: readonly PageDefinition[]): DefinitionRegistry {
  const registry = new Map<string, PageDefinition>();
  for (const definition of definitions) {
    if (registry.has(definition.id)) throw new Error(`Duplicate page definition: ${definition.id}`);
    registry.set(definition.id, definition);
  }
  return registry;
}

export function resetLevel(level: LevelDefinition, definitions: DefinitionRegistry): WorldState {
  if (!Number.isInteger(level.width) || !Number.isInteger(level.height) || level.width <= 0 || level.height <= 0) {
    throw new Error(`Invalid board dimensions for level ${level.id}`);
  }

  const pageIds = new Set<string>();
  const occupied = new Set<string>();
  const pages: PageState[] = level.pages.map((seed) => {
    if (pageIds.has(seed.id)) throw new Error(`Duplicate page id: ${seed.id}`);
    pageIds.add(seed.id);
    requireDefinition(definitions, seed.definitionId);
    assertInBounds(seed.position, level.width, level.height, seed.id);

    const key = positionKey(seed.position);
    if (occupied.has(key)) throw new Error(`Duplicate page position: ${key}`);
    occupied.add(key);

    return {
      id: seed.id,
      definitionId: seed.definitionId,
      position: { ...seed.position },
      rotation: seed.rotation ?? 0,
      state: { ...(seed.state ?? {}) },
    };
  });

  if (!pageIds.has(level.travelerStartPageId)) {
    throw new Error(`Traveler start page does not exist: ${level.travelerStartPageId}`);
  }

  return {
    levelId: level.id,
    width: level.width,
    height: level.height,
    pages,
    travelerPageId: level.travelerStartPageId,
    revision: 0,
  };
}

export function rotatePage(
  world: WorldState,
  definitions: DefinitionRegistry,
  pageId: string,
  clockwiseQuarterTurns = 1,
): WorldState {
  const page = requirePage(world, pageId);
  const definition = requireDefinition(definitions, page.definitionId);
  if (definition.canRotate === false) throw new Error(`Page cannot rotate: ${pageId}`);

  const nextRotation = rotateRotation(page.rotation, clockwiseQuarterTurns);
  if (nextRotation === page.rotation) return world;

  return {
    ...world,
    revision: world.revision + 1,
    pages: world.pages.map((candidate) =>
      candidate.id === pageId ? { ...candidate, rotation: nextRotation } : candidate,
    ),
  };
}

export function swapPages(
  world: WorldState,
  definitions: DefinitionRegistry,
  firstPageId: string,
  secondPageId: string,
): WorldState {
  if (firstPageId === secondPageId) return world;

  const first = requirePage(world, firstPageId);
  const second = requirePage(world, secondPageId);
  if (requireDefinition(definitions, first.definitionId).canSwap === false) {
    throw new Error(`Page cannot swap: ${firstPageId}`);
  }
  if (requireDefinition(definitions, second.definitionId).canSwap === false) {
    throw new Error(`Page cannot swap: ${secondPageId}`);
  }

  return {
    ...world,
    revision: world.revision + 1,
    pages: world.pages.map((candidate) => {
      if (candidate.id === firstPageId) return { ...candidate, position: { ...second.position } };
      if (candidate.id === secondPageId) return { ...candidate, position: { ...first.position } };
      return candidate;
    }),
  };
}

export function moveTravelerToPage(world: WorldState, pageId: string): WorldState {
  requirePage(world, pageId);
  if (world.travelerPageId === pageId) return world;
  return {
    ...world,
    travelerPageId: pageId,
    revision: world.revision + 1,
  };
}

export function buildAdjacencyGraph(world: WorldState, definitions: DefinitionRegistry): AdjacencyGraph {
  validateWorld(world, definitions);
  const byPosition = new Map(world.pages.map((page) => [positionKey(page.position), page] as const));
  const graph = new Map<string, readonly string[]>();

  for (const page of world.pages) {
    const exits = new Set(rotatedPageExits(page, definitions));
    const neighbors: string[] = [];

    for (const direction of CARDINAL_DIRECTIONS) {
      if (!exits.has(direction)) continue;
      const offset = directionOffset(direction);
      const neighbor = byPosition.get(positionKey({
        row: page.position.row + offset.row,
        column: page.position.column + offset.column,
      }));
      if (!neighbor) continue;
      const neighborExits = new Set(rotatedPageExits(neighbor, definitions));
      if (neighborExits.has(oppositeDirection(direction))) neighbors.push(neighbor.id);
    }

    graph.set(page.id, neighbors);
  }

  return graph;
}

export function reachablePages(graph: AdjacencyGraph, startPageId: string): ReadonlySet<string> {
  if (!graph.has(startPageId)) throw new Error(`Graph does not contain start page: ${startPageId}`);
  const visited = new Set<string>([startPageId]);
  const queue = [startPageId];

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === undefined) break;
    for (const neighbor of graph.get(current) ?? []) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      queue.push(neighbor);
    }
  }

  return visited;
}

export function shortestPath(
  graph: AdjacencyGraph,
  startPageId: string,
  destinationPageId: string,
): readonly string[] | null {
  if (!graph.has(startPageId)) throw new Error(`Graph does not contain start page: ${startPageId}`);
  if (!graph.has(destinationPageId)) throw new Error(`Graph does not contain destination page: ${destinationPageId}`);
  if (startPageId === destinationPageId) return [startPageId];

  const previous = new Map<string, string | null>([[startPageId, null]]);
  const queue = [startPageId];

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === undefined) break;

    for (const neighbor of graph.get(current) ?? []) {
      if (previous.has(neighbor)) continue;
      previous.set(neighbor, current);
      if (neighbor === destinationPageId) return reconstructPath(previous, destinationPageId);
      queue.push(neighbor);
    }
  }

  return null;
}

export function rotatedPageExits(page: PageState, definitions: DefinitionRegistry): readonly Direction[] {
  return rotateExits(requireDefinition(definitions, page.definitionId).baseExits, page.rotation);
}

export function pageAt(world: WorldState, position: GridPosition): PageState | undefined {
  return world.pages.find(
    (page) => page.position.row === position.row && page.position.column === position.column,
  );
}

function reconstructPath(previous: ReadonlyMap<string, string | null>, destinationPageId: string): readonly string[] {
  const path: string[] = [];
  let cursor: string | null = destinationPageId;
  while (cursor !== null) {
    path.push(cursor);
    cursor = previous.get(cursor) ?? null;
  }
  return path.reverse();
}

function validateWorld(world: WorldState, definitions: DefinitionRegistry): void {
  const pageIds = new Set<string>();
  const occupied = new Set<string>();

  for (const page of world.pages) {
    if (pageIds.has(page.id)) throw new Error(`Duplicate page id: ${page.id}`);
    pageIds.add(page.id);
    requireDefinition(definitions, page.definitionId);
    assertInBounds(page.position, world.width, world.height, page.id);
    const key = positionKey(page.position);
    if (occupied.has(key)) throw new Error(`Duplicate page position: ${key}`);
    occupied.add(key);
  }

  if (!pageIds.has(world.travelerPageId)) {
    throw new Error(`Traveler page does not exist: ${world.travelerPageId}`);
  }
}

function requirePage(world: WorldState, pageId: string): PageState {
  const page = world.pages.find((candidate) => candidate.id === pageId);
  if (!page) throw new Error(`Unknown page: ${pageId}`);
  return page;
}

function requireDefinition(definitions: DefinitionRegistry, definitionId: string): PageDefinition {
  const definition = definitions.get(definitionId);
  if (!definition) throw new Error(`Unknown page definition: ${definitionId}`);
  return definition;
}

function assertInBounds(position: GridPosition, width: number, height: number, pageId: string): void {
  if (
    !Number.isInteger(position.row) ||
    !Number.isInteger(position.column) ||
    position.row < 0 ||
    position.column < 0 ||
    position.row >= height ||
    position.column >= width
  ) {
    throw new Error(`Page ${pageId} is out of bounds at ${positionKey(position)}`);
  }
}
