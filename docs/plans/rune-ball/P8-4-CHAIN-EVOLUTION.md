# P8.4 — Chain Evolution Gate

## Risk question

Can Chain create two genuinely different propagation decisions — broad network routing versus concentrated terminal cash-out — without collapsing into a stat-only “more chain targets” upgrade?

## Product thesis

Chain owns **PROPAGATION / PAYOFF**. Vortex changes target arrangement, Split changes attack space, and Chain should change where the value of one impact travels next.

The two paths therefore ask different targeting questions:

- **Relay:** “Which first target gives me a bridge into the rest of the arena?”
- **Detonation:** “Which first target produces the best endpoint for the final cash-out?”

## Shared evolution rule

Chain still uses the established automatic evolution cadence:

- T1 at 3 qualified uses
- T2 at 6 qualified uses

A Chain use qualifies only when propagation reaches at least **2 secondary route targets**. Drawing Z and consuming it on an isolated hit does not progress the tree. Detonation-only terminal splash does not substitute for a real route.

## Relay — Network / Spread

### T1 — Relay

Base Chain changes from a radial burst around the first impact into a sequential nearest-neighbor route. Each reached target becomes the origin for the next hop.

This allows target topology to bridge beyond Base Chain’s original local radius.

### T2 — Arc Web

The main relay route remains sequential, but a hard-capped number of lateral forks can branch from relay origins. Forks deal Chain damage but do not recursively create more forks.

Identity: `Find bridge → relay → branch → spread the network`.

## Detonation — Terminal / Cash-out

### T1 — Fuse

Chain follows a tighter sequential route. If the route reaches at least one secondary target, the endpoint emits a controlled local detonation that can damage a small number of nearby unvisited targets.

### T2 — Critical Mass

The sequential route can travel one hop farther. Each successful route hop increases the terminal radius, up to the authored hard cap implied by the profile. The terminal target count remains bounded.

Identity: `Route → choose endpoint → cash out`.

## Architecture

```text
ChainEvolutionCatalog
├─ Relay / Arc Web
└─ Detonation / Fuse / Critical Mass
        ↓
ChainEvolutionSystem (3 / 6 qualified uses)
        ↓
ChainEvolutionTuning
        ↓
planChainPropagation(...)  ← pure route planner
        ↓
DestructionSession applies planned target hits
```

The planner is deterministic and presentation-independent. Damage still flows through the existing `resolveTargetHit(...)` path, so combo, Flow, armor handling, charge, audio events, and target removal keep one source of truth.

## Presentation contract for this gameplay gate

P8.4 intentionally does not reopen the Split production-FX pipeline.

The existing Chain line language is reused, but `chain-triggered` now carries authored links so Relay paths render target-to-target instead of falsely radiating from the first impact. Detonation also exposes its terminal center/radius for a simple payoff ring.

Full Chain SVG/material/particle polish is deferred until gameplay identity passes.

## Persistence / Tree

- Chain build path is persisted alongside Vortex and Split.
- Default Chain path: Relay.
- Rune Tree exposes both Chain branches with direct-tap path switching.
- Home / Stage build summary includes the selected Chain path.
- The shared evolution HUD follows Chain when Chain progression changes.

## Scope guard

Not in this gate:

- Chain shader/bloom pass
- authored Chain SVG runtime silhouette
- new sound assets
- damage multipliers
- extra armored-target rules
- economy/progression currency
- stage-specific Chain bonuses
- Vortex/Split balance changes

## Phone gate

1. Base Chain still feels familiar before evolution.
2. Relay T1 makes bridge targets matter and can reach a cluster that Base Chain could not reach directly.
3. Arc Web adds visible spread without turning into uncontrolled recursive clearing.
4. Fuse makes the endpoint matter more than raw coverage.
5. Critical Mass rewards a longer successful route with a stronger terminal zone.
6. Switching Relay / Detonation in Rune Tree changes the next run and persists across reload.
7. Empty/weak Chain casts do not advance evolution; reaching at least two secondary route targets does.
8. Chain evolution feedback uses the same 3 / 6 HUD grammar as Vortex and Split.
9. Combo, Flow, Overdrive, armor, input feel, and mobile frame pacing show no regression.
