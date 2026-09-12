# P8.4.1 — Chain Mechanic Separation Pass

## Problem

P8.4 technically created Relay and Detonation branches, but phone playtest found that the two branches still felt too similar. Both were resolved synchronously as `hit → propagate → more Chain damage`, so differences in radius, route shape, and terminal splash were perceptually compressed by the game's speed.

## Risk question

Can Chain's two paths become distinguishable by timing and payoff structure alone — before production FX — so a two-second gameplay clip is enough to tell Relay from Detonation?

## Mechanic contract

### Relay / Arc Web

Relay is immediate propagation.

- The primary hit arms a deterministic route.
- Secondary Chain damage is no longer resolved in the same simulation step.
- Route hits arrive sequentially at a short authored cadence.
- Arc Web forks are still hard-capped and occur as part of the crawl, never recursively.

Identity: `Hit → Zap → Zap → Zap → Spread`.

### Detonation / Critical Mass

Detonation is delayed cash-out.

- The primary hit computes and marks a Fuse route.
- Intermediate Fuse route nodes do **not** receive immediate Chain damage.
- The route exists as setup/targeting information while a short terminal charge runs.
- When the charge completes, the endpoint detonates once and damages the terminal endpoint plus a bounded number of nearby unvisited targets.
- Critical Mass increases terminal radius with successful route length, preserving the authored cap.

Identity: `Hit → Mark → Mark → Charge → BOOM`.

This intentionally sacrifices Relay-like immediate value in exchange for a concentrated endpoint payoff.

## Qualification

Qualification remains route-based:

- A Chain cast qualifies at two or more secondary route nodes.
- Relay qualifies from the authored route even though damage arrives over time.
- Detonation qualifies from the Fuse route; terminal splash does not substitute for route quality.
- Auto-evolution remains T1 at 3 qualified uses and T2 at 6.

## Architecture

The propagation planner remains pure and deterministic. Timing is owned by `DestructionSession` through a small pending Chain action queue:

- Relay actions schedule per-link Chain hits.
- Detonation schedules one terminal cash-out.
- All actual damage still flows through `resolveTargetHit(...)` so combo, Flow, armor, score attribution, and target removal retain one source of truth.

Presentation receives explicit lifecycle events instead of inferring timing from one synchronous `chain-triggered` event.

## Scope guard

Not in this pass:

- production Chain SVG/material/particle polish
- damage multipliers
- new sound assets
- new target types
- Vortex/Split balance changes
- economy or stage bonuses

## Phone gate

1. A two-second clip is enough to distinguish Relay from Detonation without reading HUD text.
2. Relay visibly crawls across targets instead of resolving as one simultaneous burst.
3. Arc Web keeps the crawl readable while adding bounded lateral spread.
4. Detonation has a readable setup pause before a single terminal payoff.
5. Fuse route nodes no longer feel like Relay hits with an extra explosion attached.
6. Critical Mass produces a stronger endpoint zone when the route is longer without becoming full-arena clear.
7. The two paths encourage different first-target choices.
8. Qualification, 3/6 evolution cadence, combo, Flow, armor, input feel, and mobile frame pacing do not regress.
