import type { TargetState } from '../game/TargetSystem';
import type { Point2D } from '../input/SwipeClassifier';
import type { ChainEvolutionPath, ChainEvolutionStage } from './RuneEvolutionCatalog';

export type ChainPropagationMode = 'base' | 'relay' | 'detonation';
export type ChainLinkKind = 'route' | 'fork' | 'terminal';

export interface ChainCastProfile {
  mode: ChainPropagationMode;
  hopRadius: number;
  maxHops: number;
  forkRadius: number;
  maxForks: number;
  terminalBaseRadius: number;
  terminalRadiusPerHop: number;
  terminalTargetLimit: number;
}

export interface ChainPropagationLink {
  from: Point2D;
  to: Point2D;
  targetId: number;
  kind: ChainLinkKind;
}

export interface ChainPropagationPlan {
  mode: ChainPropagationMode;
  routeTargetIds: number[];
  forkTargetIds: number[];
  terminalTargetIds: number[];
  allTargetIds: number[];
  links: ChainPropagationLink[];
  terminalCenter: Point2D | null;
  terminalRadius: number;
  qualificationCount: number;
}

export const BASE_CHAIN_PROFILE: ChainCastProfile = {
  mode: 'base',
  hopRadius: 155,
  maxHops: 3,
  forkRadius: 0,
  maxForks: 0,
  terminalBaseRadius: 0,
  terminalRadiusPerHop: 0,
  terminalTargetLimit: 0,
};

export function getChainCastProfile(
  path: ChainEvolutionPath,
  stage: ChainEvolutionStage,
): ChainCastProfile {
  if (stage === 0) return BASE_CHAIN_PROFILE;

  if (path === 'relay') {
    return stage === 1
      ? {
          mode: 'relay',
          hopRadius: 150,
          maxHops: 4,
          forkRadius: 0,
          maxForks: 0,
          terminalBaseRadius: 0,
          terminalRadiusPerHop: 0,
          terminalTargetLimit: 0,
        }
      : {
          mode: 'relay',
          hopRadius: 155,
          maxHops: 4,
          forkRadius: 108,
          maxForks: 2,
          terminalBaseRadius: 0,
          terminalRadiusPerHop: 0,
          terminalTargetLimit: 0,
        };
  }

  return stage === 1
    ? {
        mode: 'detonation',
        hopRadius: 125,
        maxHops: 3,
        forkRadius: 0,
        maxForks: 0,
        terminalBaseRadius: 0,
        terminalRadiusPerHop: 0,
        terminalTargetLimit: 0,
      }
    : {
        mode: 'detonation',
        hopRadius: 132,
        maxHops: 4,
        forkRadius: 0,
        maxForks: 0,
        terminalBaseRadius: 0,
        terminalRadiusPerHop: 0,
        terminalTargetLimit: 0,
      };
}

interface Candidate {
  id: number;
  position: Point2D;
  distance: number;
}

function nearestCandidate(
  origin: Point2D,
  targets: ReadonlyMap<number, TargetState>,
  radius: number,
): Candidate | null {
  let best: Candidate | null = null;
  for (const target of targets.values()) {
    const distance = Math.hypot(target.position.x - origin.x, target.position.y - origin.y);
    if (distance > radius) continue;
    if (best && distance >= best.distance) continue;
    best = { id: target.id, position: { ...target.position }, distance };
  }
  return best;
}

function pushLink(
  links: ChainPropagationLink[],
  from: Point2D,
  candidate: Candidate,
  kind: ChainLinkKind,
): void {
  links.push({
    from: { ...from },
    to: { ...candidate.position },
    targetId: candidate.id,
    kind,
  });
}

export function planChainPropagation(
  origin: Point2D,
  targets: readonly TargetState[],
  excluded: ReadonlySet<number>,
  profile: ChainCastProfile,
): ChainPropagationPlan {
  const available = new Map<number, TargetState>();
  for (const target of targets) {
    if (!excluded.has(target.id)) available.set(target.id, target);
  }

  const routeTargetIds: number[] = [];
  const forkTargetIds: number[] = [];
  const terminalTargetIds: number[] = [];
  const links: ChainPropagationLink[] = [];

  if (profile.mode === 'base') {
    const candidates = [...available.values()]
      .map((target) => ({
        id: target.id,
        position: { ...target.position },
        distance: Math.hypot(target.position.x - origin.x, target.position.y - origin.y),
      }))
      .filter((candidate) => candidate.distance <= profile.hopRadius)
      .sort((left, right) => left.distance - right.distance)
      .slice(0, profile.maxHops);

    for (const candidate of candidates) {
      routeTargetIds.push(candidate.id);
      pushLink(links, origin, candidate, 'route');
    }

    return {
      mode: profile.mode,
      routeTargetIds,
      forkTargetIds,
      terminalTargetIds,
      allTargetIds: [...routeTargetIds],
      links,
      terminalCenter: null,
      terminalRadius: 0,
      qualificationCount: routeTargetIds.length,
    };
  }

  let current = { ...origin };
  let forksRemaining = profile.maxForks;
  for (let hop = 0; hop < profile.maxHops; hop += 1) {
    const next = nearestCandidate(current, available, profile.hopRadius);
    if (!next) break;

    available.delete(next.id);
    routeTargetIds.push(next.id);
    pushLink(links, current, next, 'route');

    if (profile.mode === 'relay' && forksRemaining > 0 && profile.forkRadius > 0) {
      const fork = nearestCandidate(current, available, profile.forkRadius);
      if (fork) {
        available.delete(fork.id);
        forkTargetIds.push(fork.id);
        pushLink(links, current, fork, 'fork');
        forksRemaining -= 1;
      }
    }

    current = { ...next.position };
  }

  if (profile.mode === 'relay') {
    const allTargetIds = [...routeTargetIds, ...forkTargetIds];
    return {
      mode: profile.mode,
      routeTargetIds,
      forkTargetIds,
      terminalTargetIds,
      allTargetIds,
      links,
      terminalCenter: null,
      terminalRadius: 0,
      qualificationCount: allTargetIds.length,
    };
  }

  const terminalCenter = routeTargetIds.length > 0 ? { ...current } : null;
  const terminalRadius = terminalCenter
    ? profile.terminalBaseRadius + profile.terminalRadiusPerHop * routeTargetIds.length
    : 0;

  if (terminalCenter && terminalRadius > 0 && profile.terminalTargetLimit > 0) {
    const terminalCandidates = [...available.values()]
      .map((target) => ({
        id: target.id,
        position: { ...target.position },
        distance: Math.hypot(target.position.x - terminalCenter.x, target.position.y - terminalCenter.y),
      }))
      .filter((candidate) => candidate.distance <= terminalRadius)
      .sort((left, right) => left.distance - right.distance)
      .slice(0, profile.terminalTargetLimit);

    for (const candidate of terminalCandidates) {
      terminalTargetIds.push(candidate.id);
      pushLink(links, terminalCenter, candidate, 'terminal');
    }
  }

  return {
    mode: profile.mode,
    routeTargetIds,
    forkTargetIds,
    terminalTargetIds,
    allTargetIds: [...routeTargetIds, ...terminalTargetIds],
    links,
    terminalCenter,
    terminalRadius,
    qualificationCount: routeTargetIds.length,
  };
}
