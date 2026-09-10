# Rune Ball — P7.2 Vortex Evolution Tree Gate

## Product pivot

P7.1 validated two useful ideas: per-Rune progression is readable during a run, and an upper-tier Vortex can have a strong presentation identity. It also exposed two problems with the manual Ascension release model: the extra tap was not the intended interaction grammar, and cast-count charging encouraged low-value Vortex spam.

P7.2 supersedes the P7.1 runtime interaction model.

The new grammar is:

```text
Pre-run: choose a Rune evolution path
In-run: play with Swipe + Rune gestures only
Qualified Rune uses: advance the selected path automatically
Evolution: permanently changes later casts for the rest of the run
```

No additional gameplay button is introduced.

## Risk question

Can a pre-run Vortex build choice become meaningfully visible during a 75-second run through automatic evolution, while preserving Rune Ball's gesture-first play and avoiding empty-cast spam?

## Vertical slice

Only Vortex receives an evolution tree in P7.2.

```text
                      VORTEX
                        │
             ┌──────────┴──────────┐
             │                     │
        GRAVITY PATH          ORBIT PATH
             │                     │
       GRAVITY WELL              ORBIT
             │                     │
        SINGULARITY          EVENT HORIZON
```

Before each run, the player selects one of the two paths. Retry returns to path selection so the alternate build can be tried immediately.

## Evolution cadence

- Stage 0: Base Vortex
- 3 qualified Vortex uses: automatic Stage 1 evolution
- 6 qualified Vortex uses: automatic Stage 2 evolution
- Stage 2 remains active until the run ends

The cast that reaches an evolution threshold still resolves with the stage that was active when it began. The newly evolved rules apply to future Vortex casts.

### Qualified Vortex use

A successful Vortex cast only advances evolution when at least one target is inside that cast's effective Vortex radius at activation time.

This first qualification rule is deliberately simple and deterministic:

```text
Successful ○ recognition
+ Rune charge accepted
+ at least one target in effective field
= one qualified Vortex use
```

An off-target / empty Vortex still performs its normal gameplay action and spends normal Rune charge, but does not advance evolution.

## Path identity

| Stage | Gravity Path | Orbit Path |
|---|---|---|
| Base | Vortex — short target pull | Vortex — short target pull |
| T1 | **Gravity Well** — larger field, longer duration, stronger inward pull | **Orbit** — targets gain tangential motion plus inward capture |
| T2 | **Singularity** — stronger/longer Gravity Well; every cast ends in a collapse pulse | **Event Horizon** — larger/longer/stronger orbital control field |

The intent is qualitative play-pattern divergence, not a choice between percentage modifiers.

### Gravity → Singularity

The path emphasizes `gather → cluster → payoff`.

At T2, Singularity is no longer a one-shot ultimate. Every later Vortex cast behaves as the evolved form and resolves into a bounded Vortex-authored collapse pulse.

### Orbit → Event Horizon

The path emphasizes `capture → rotate → reposition`.

Targets move tangentially around the cast center while being drawn inward. Event Horizon extends that control identity rather than adding a collapse burst.

## Architecture

- `VortexEvolutionSystem` owns renderer-independent path / stage / qualified-use state.
- `DestructionSession` owns qualification and stage-specific Vortex rules.
- `RuneSystem` accepts the duration of the active Vortex cast without knowing evolution semantics.
- `TargetSystem` provides bounded pull and orbit field operations.
- `VortexBuildPicker` is pre-run configuration UI only.
- `VortexEvolutionStatus` is a quiet non-interactive in-run status surface.
- `RuneCausalityOverlay` provides the primary world-space evolution / collapse feedback.
- `DestructionScene` receives the selected path at construction and contains no evolution progression state.

P7.1 `AscensionCard`, manual release API, energy system, and related tests are removed rather than retained as a second gameplay model.

## UI / UX contract

- Path selection happens before the run and may use a focused modal because it is an explicit build decision, not gameplay HUD.
- The central arena remains visually dominant during play.
- In-run evolution status is informational only; it never becomes tappable.
- Evolution completion must be primarily communicated by world response, with the bottom status acting as confirmation.
- The player never needs to look away from the arena to activate an evolved Rune.
- Existing Sound / Reduced Motion / safe-area / contrast rules remain in force.

## Scope guard

P7.2 does **not** add:

- Split or Chain evolution trees;
- persistent meta progression or unlock economy;
- rarity, equipment, cards, or stat-roll systems;
- new runtime skill buttons;
- Overdrive Archetypes;
- cross-Rune evolution synergy;
- a full balance sweep;
- Production Pages Smoke validation.

The Production Pages Smoke Gate remains intentionally deferred while the Post-MVP design track is active.

## Phone gate

1. Pre-run path selection is understandable without becoming a large loadout screen.
2. The player can tell that selecting Gravity versus Orbit changes later Vortex behavior.
3. Three and six qualified uses are reachable naturally within a 75-second run.
4. Empty/off-target Vortex spam does not advance evolution.
5. T1 and T2 auto-evolution are noticeable without interrupting control.
6. Singularity reads as an evolved Vortex on every later cast: gather → collapse, not a one-shot ultimate.
7. Orbit / Event Horizon produces a visibly different control pattern from Gravity / Singularity.
8. After completing one run, the player has a reason to try the other path on Retry.
9. The bottom evolution status does not compete with Ball, targets, Rune feedback, or Overdrive.

## Gate decision

P7.2 passes only if the path choice changes player-visible behavior enough to feel like a build, while the in-run control grammar remains only:

```text
Swipe = trajectory authority
Rune gesture = rule-changing action
```

If both paths mostly feel like stronger Vortexes, do not expand the tree to Split / Chain yet; strengthen path identity first.
