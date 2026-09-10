# Rune Ball — P8.2 Rune Tree UX & Build Configuration Gate

## Risk question

**Can the player understand a Rune's base behavior, compare evolution branches, inspect what each tier changes, and deliberately equip a build without turning Rune Ball into a dense RPG stat screen?**

P8.2 deepens the product-level configuration surface established by P8.1. It does not add new Rune mechanics.

## Product decision

The Rune Tree is not an in-run skill bar and not a collection of immediate-cast buttons. It is the persistent build-authoring surface.

Interaction grammar:

```text
Choose Rune
→ inspect Base Rune
→ compare Branch identities
→ inspect T1 / T2 nodes
→ EQUIP PATH
→ leave Rune Tree
→ enter Stage
→ qualified uses auto-evolve that equipped path during the run
```

Inspecting a node must not silently change the player's build. Configuration commits only through the explicit `EQUIP ... PATH` action.

## Information hierarchy

The screen is organized into four layers:

1. **Rune selector** — Vortex / Split / Chain.
2. **Active build summary** — the currently equipped path and final evolution.
3. **Tree graph** — Base Rune, branch rails, T1 nodes, T2 nodes.
4. **Node detail** — mechanical description, play pattern, evolution trigger, and Equip action when applicable.

The graph answers *where does this build go?* The detail panel answers *how will this change the way I play?*

## Vortex tree

P8.2 uses the already validated P7.2 mechanics.

```text
                       VORTEX
                         ○
                         │
                ┌────────┴────────┐
                │                 │
             GRAVITY            ORBIT
                │                 │
          GRAVITY WELL           ORBIT
              T1 · 3           T1 · 3
                │                 │
          SINGULARITY       EVENT HORIZON
              T2 · 6           T2 · 6
```

### Gravity path

Identity: **Cluster / Collapse**

- **Gravity Well:** larger field, longer duration, stronger inward pull.
- **Singularity:** stronger/longer Gravity Well; every evolved Vortex ends with a collapse pulse.

Play grammar: `Gather → compress → collapse / chain payoff`.

### Orbit path

Identity: **Capture / Control**

- **Orbit:** targets gain tangential motion plus inward capture.
- **Event Horizon:** larger, longer, stronger orbital control field.

Play grammar: `Capture → orbit → sustain → release`.

## Qualified-use rule

The Tree communicates the existing automatic progression rule rather than inventing a new progression layer:

```text
Base Vortex
→ 3 qualified uses → T1
→ 6 qualified uses → T2
```

A Vortex use only qualifies when at least one target is inside the effective field at cast time. The Tree therefore describes evolution as an automatic consequence of effective play, not XP grinding or button charging.

## Split / Chain treatment

Split and Chain remain selectable in the Rune selector so the product architecture already supports a multi-Rune library.

For P8.2 they show:

- current Base Rune identity;
- current Base Rune play pattern;
- two clearly non-interactive future branch rails;
- `PATHS NOT YET AUTHORED` rather than fake locked rewards.

Do not invent Split / Chain evolution mechanics merely to fill empty UI.

## Semantic catalog

P8.2 introduces a shared `RuneEvolutionCatalog` as the source of truth for:

- Rune names, glyphs, and gameplay roles;
- Vortex branch names and identities;
- Tier node names and thresholds;
- mechanical descriptions and play-pattern summaries;
- domain stage names shown by `VortexEvolutionSystem`;
- in-run evolution status labels;
- Home / Stage build summaries.

This prevents the Rune Tree, runtime domain, and HUD from drifting into different terminology as the progression system expands.

## UI / UX rules

- Tree structure is spatial; descriptions stay in the detail panel instead of being repeated inside every node.
- Base / T1 / T2 hierarchy must be readable without reading paragraphs.
- Current equipped branch uses restrained cyan continuity; node inspection uses a separate selection treatment.
- `EQUIP PATH` is the only primary action inside the detail panel.
- An already equipped path shows a disabled `EQUIPPED` state rather than a second active CTA.
- Product typography remains system-first; Rune glyphs, tier metadata, and triggers may use the existing monospace accent language.
- Touch targets remain phone-comfortable; the Tree stays vertically scrollable on short screens.
- Reduced Motion / Reduced Transparency / Increased Contrast fallbacks remain respected.

## Architecture

```text
GameShell
└─ RuneTreePanel
   ├─ Rune selector
   ├─ Tree graph
   └─ Node detail / Equip action

RuneEvolutionCatalog
├─ Base Rune semantics
├─ Vortex path semantics
├─ evolution thresholds
└─ stage-name mapping

PlayerProfile
└─ equipped Vortex path

VortexEvolutionSystem
└─ runtime automatic evolution using shared catalog semantics
```

`RuneTreePanel` owns presentation and inspection state only. The persisted build remains owned by `PlayerProfile`; runtime evolution remains renderer-independent.

## Scope guard

P8.2 does **not** add:

- Split / Chain evolution abilities;
- additional Vortex branches;
- unlock currency or skill points;
- account/backend progression;
- per-node stat allocation;
- in-run respec;
- Overdrive Archetypes;
- stage gameplay variants;
- Production Pages Smoke.

## Phone gate

1. Vortex / Split / Chain are identifiable within 1–2 seconds.
2. The player can distinguish **currently equipped path** from **currently inspected node**.
3. T1 and T2 progression order is visually obvious without reading the detail copy.
4. Tapping a node only inspects it; the build changes only after `EQUIP PATH`.
5. Gravity reads as cluster/collapse while Orbit reads as capture/control.
6. The player can explain roughly what a selected node will do after reading one compact detail panel.
7. Split / Chain future trees read as intentionally unauthored, not broken or secretly unlockable content.
8. Leaving and returning to Runes preserves the equipped path; Home / Stage Detail summaries stay in sync.
9. The Tree remains comfortable to scroll and tap on a short phone without becoming visually denser than the rest of the product shell.

If this gate passes, the same information architecture can carry authored Split / Chain trees without another navigation redesign.
