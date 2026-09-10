# Rune Ball — P8.2.1 Rune Tree + Arena Clarity Refinement

## Why this pass exists

P8.2 validated the Rune selector, spatial tree, detail density, and mobile scrolling. Phone feedback exposed three refinements before authoring more Rune trees:

1. The graph still carries too much text; Rune cards already provide identity, so the tree itself can communicate primarily through symbols and spatial progression.
2. Separating inspection from a second `EQUIP PATH` confirmation adds interaction cost without adding a meaningful decision for the current two-branch model.
3. Score / Combo / Flow-Overdrive / Rune charge information currently sits inside the same rounded rectangle used for collision and gesture input, making the arena feel more like a HUD panel than a clean playfield.

Orbit also reads as the correct capture/control branch but its active field resolves too quickly to establish a sustained-control identity.

## Risk question

**Can Rune configuration become more glanceable while the arena becomes visually cleaner, without losing build clarity, control readability, or usable phone play space?**

## Rune Tree interaction contract

The Rune selector remains a card-like surface because phone testing found `○ Vortex / V Split / Z Chain` immediately readable.

Inside the selected Rune, the graph becomes glyph-first:

```text
                 ○
                 │
          ┌──────┴──────┐
          •             ◌
          │             │
         ◎             ◉
          │             │
         ◉             ◎
```

The exact symbols are visual signatures, not textual abbreviations. Names, mechanics, play pattern, and qualified-use threshold live in the detail surface below the graph.

### Selection rule

For authored Vortex branches:

```text
Tap Gravity node → Gravity path becomes active immediately → detail shows tapped node
Tap Orbit node   → Orbit path becomes active immediately   → detail shows tapped node
```

There is no separate `EQUIP PATH` button in P8.2.1.

The selected node still answers *which tier am I reading?* while cyan branch continuity answers *which path is active?* Because inspecting the opposite branch now activates it immediately, the UI no longer maintains a confusing cross-branch “inspected but not equipped” state.

Split and Chain remain Base-only / unauthored. Their future branches use neutral graphical placeholders and remain non-interactive.

## Glyph grammar

The visual language should make branch identity recognizable before the player reads the detail card:

- **Gravity** — concentric compression rings around a central core; T2 becomes denser/brighter to imply collapse.
- **Orbit** — orbital ring with satellites; T2 adds a stronger outer horizon / second orbital structure.
- **Base Vortex** — the canonical `○` Rune.

The tree does not print node names or thresholds inside every node. Accessibility labels retain the full semantic names and automatic-evolution thresholds.

## Orbit tuning

Gravity remains the shorter `gather → collapse` branch. Orbit is deliberately given a longer active field so `capture → sustain → release` is materially readable:

| Stage | Gravity duration | Orbit duration |
| --- | ---: | ---: |
| T1 | 0.78 s | **1.35 s** |
| T2 | 0.96 s | **1.85 s** |

Radius and pull/orbit coefficients otherwise retain their P7.2 identity for this pass. The goal is not a broad balance pass; it is to make duration reinforce branch differentiation.

## Arena layout contract

Gameplay UI is split into three physical zones:

```text
Top telemetry / system gutter
Timer · Score · Combo · Flow / Overdrive · Settings

┌────────────────────────────┐
│                            │
│      COLLISION ARENA       │
│ Ball · Targets · Rune · VFX│
│                            │
└────────────────────────────┘

Bottom Rune gutter
Rune charge · ○ V Z · Evolution status
```

The rounded Arena is no longer merely a visual frame. Its bounds are also the Ball bounds, Target bounds, and pointer hit area.

### Invariants

- Score and Combo are above the collision bounds.
- Flow / Overdrive meter is above the collision bounds.
- Rune charge meter and Rune guide are below the collision bounds.
- In-run Evolution status remains in the reserved lower UI area rather than covering targets.
- Camera motion affects world-space content, not HUD gutters.
- A short 320×568 viewport must still retain a collision arena larger than 260×360 CSS pixels.

This makes “inside the frame = play” a stable spatial rule for future stage design.

## Architecture

```text
ArenaLayout
├─ collision bounds
├─ top telemetry anchors
└─ bottom Rune anchors

DestructionScene
├─ CameraRig / world-space arena
└─ screen-space HUD → ArenaLayout anchors

RuneTreePanel
├─ Rune cards
├─ glyph-only evolution graph
└─ semantic detail surface

VortexEvolutionTuning
└─ stage-specific Vortex field profiles
```

`ArenaLayout` owns presentation geometry only. Collision remains in the gameplay domain via the `ArenaBounds` passed into `DestructionSession`.

`VortexEvolutionTuning` extracts the previously inline Vortex field profiles so branch-duration tuning is testable without coupling it to Pixi presentation.

## Scope guard

P8.2.1 does **not** add:

- Split / Chain evolution mechanics;
- new Vortex branches;
- new stage content or stage modifiers;
- currencies / skill points / unlock economy;
- Overdrive Archetypes;
- progression rewards;
- backend/account work;
- Production Pages Smoke.

## Phone gate

1. Rune cards still make Vortex / Split / Chain immediately identifiable.
2. Vortex tree can be scanned primarily as shapes; node names are discovered in the detail card rather than repeated across the graph.
3. Tapping a Gravity or Orbit node immediately changes the active branch and persisted Home / Stage build summary; no extra confirmation feels missing.
4. Active branch continuity and the currently viewed T1/T2 node remain understandable without competing cyan/magenta “equipped vs inspected” concepts.
5. Orbit / Event Horizon now feels sustained enough to support capture/control rather than looking like a short visual variant of Gravity.
6. Score, Combo, Flow/Overdrive, Rune charge, Rune guide, and Evolution status do not cover the collision playfield.
7. Ball, targets, pointer input, and wall rebound stay inside the visible rounded Arena after resize/orientation changes.
8. On a short phone the arena still feels large enough for Swipe and Rune gestures; no gesture or target-density regression appears.

If this gate passes, Rune Tree UI and Arena spatial hierarchy are stable enough to resume authored Split / Chain evolution work.
