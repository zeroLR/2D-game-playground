# P8.4.2 — Detonation Delayed Zone Gate

## Why

P8.4.1 successfully separated the temporal rhythm of Relay and Detonation, but phone playtest still found the strategic choice weak. Relay visibly crawled through targets, while Detonation still asked for an endpoint decision that the current sparse, fast arena does not naturally support.

The pivot is to make Detonation own **delayed area seeding** instead of terminal cash-out.

## Risk question

Can Detonation become a genuinely different planning tool by converting current Chain route nodes into short-lived world-space blast zones that threaten the next moment of play, while Relay remains the immediate clearing option?

## Product thesis

- **Relay:** solve the targets that exist now.
- **Detonation:** reserve dangerous spaces for targets that will occupy them shortly.

The desired contrast is:

```text
Relay
Hit → Zap → Zap → Zap
      immediate clearing

Detonation
Hit → Seed → Seed → Seed
        charge...
      Boom  Boom  Boom
      delayed zoning
```

## Detonation contract

Each successful Detonation route node seeds one Fuse Zone at the node's world-space position.

A Fuse Zone:

- remains fixed in world space; it does not follow the original route target,
- visibly charges before detonation,
- does not preselect which targets it will damage,
- queries the live target snapshot only when it detonates,
- damages only a small, deterministic number of targets inside its radius,
- resolves damage through the existing `resolveTargetHit(...)` path.

This lets newly spawned, drifting, or repositioned targets enter a seeded zone after Chain has already been cast.

## Tiers

### T1 — Fuse

- one small delayed zone per route node,
- ~0.48 s charge,
- 48 px zone radius,
- maximum 2 targets per zone.

### T2 — Critical Mass

- keeps one zone per route node,
- slightly faster ~0.40 s charge,
- 56 px zone radius,
- maximum 3 targets per zone,
- longer authored route still produces more seeded territory, but no full-arena clear.

T2 escalates spatial coverage without turning the mechanic back into one large terminal explosion.

## Architecture

```text
planChainPropagation(...)
      ↓ route topology only
ChainResolutionTimeline
      ↓ creates world-space Fuse Zones
DestructionSession pending zones
      ↓ detonation time
live Target snapshot query
      ↓
resolveTargetHit(...)
```

Relay remains unchanged from P8.4.1.

## Presentation contract

The gameplay should explain itself in the arena:

- every Detonation route node receives a readable charging circle/sigil,
- the zone radius is visible before detonation,
- route lines are restrained so the seeded zones become the primary cue,
- each zone emits its own compact blast when the timer completes,
- no production shader/particle pass is required for this gate.

## Scope guard

Not in this gate:

- Relay rebalance,
- new target types,
- damage multipliers,
- overlapping-zone bonus damage,
- Chain production SVG/material pass,
- new audio assets,
- stage-specific bonuses,
- economy/meta progression changes.

## Phone gate

1. Relay remains the immediate `Zap → Zap → Zap` path with no regression.
2. Detonation visibly leaves one smaller charging area at each route node.
3. The charge areas stay fixed in world space rather than following targets.
4. A target entering a zone after Chain was cast can be hit when the zone detonates.
5. Detonation reads as `seed now → payoff later`, not `Relay plus an extra explosion`.
6. Sparse target layouts still produce useful delayed territory instead of demanding one perfect terminal endpoint.
7. Critical Mass expands delayed coverage without becoming a full-arena wipe.
8. Qualification, 3 / 6 evolution, combo, Flow, armor, input feel, and mobile frame pacing show no regression.
