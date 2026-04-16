---
name: game-roguelike
description: |
  Use this skill when the chosen game type is roguelike. Covers genre pillars (permadeath, procgen, turn-based depth, emergent narrative, run-based meta), the required systems checklist, the recommended stack (Vite + TS + PixiJS + rot.js), the loop pattern (turn-based speed scheduler), genre-specific pitfalls, the spec template, and reference exemplars.

  TRIGGER when: docs/concept.md names "roguelike" as the chosen genre, or the user says "roguelike", "permadeath", "procgen run", "dungeon crawl", "NetHack-like", "DCSS-like", "Brogue-like", "ToME-like", "Caves of Qud-like".

  DO NOT TRIGGER when: docs/concept.md does not yet exist — use game-concept first; the genre is something other than roguelike (use the matching game-<genre> skill); the question is purely technical with no genre context — use the relevant generic skill (game-scaffold / game-loop / game-systems / game-perf).
---

# game-roguelike

A roguelike is a turn-based game where the world is procedurally generated, death is permanent, and most of the long-term interest comes from the *interaction* of small simple systems rather than scripted content. Modern usage stretches the term ("roguelite"), so be honest with the user about which axis you're on.

This skill captures what is **specific** to the genre. Implementation patterns (FOV, dungeon gen, scheduler, save/load) live in the generic skills; this file links to them and tells you which ones you actually need.

## Genre pillars

If you remove any of these, it stops being a roguelike:

- **Permadeath.** Death ends the run; no quick-load. Without this, decisions stop mattering.
- **Procedural generation.** Maps, item placements, and (often) monster rosters differ each run. Memorisation is replaced by adaptation.
- **Turn-based depth.** Time advances on player input. Decisions are isolated and replayable mentally.
- **Emergent interactions.** Few special-cases; many simple rules that combine. ("Burning oil ignites adjacent oil" beats a hardcoded "trap room.")
- **Run-based pacing.** A single sitting (or several) ends in win or death; meta-progression, if any, sits *outside* the run.

State explicitly in `docs/concept.md` whether you are building a **classic roguelike** (all five pillars; e.g. NetHack, DCSS) or a **roguelite** (relaxed permadeath, real-time, or scripted content; e.g. Hades, Slay the Spire). The pillars you skip define the work you avoid.

## Required systems checklist

Each item links into the generic skills; do not re-implement.

- [ ] **Seeded RNG** — every `Math.random` call goes through one injected RNG. → see **game-scaffold** § "Phase 3 — Seeded RNG first" and **game-systems** § "Determinism checklist".
- [ ] **FOV (field of view)** — recompute on the player's turn only, not every frame. → see **game-systems** § "FOV (field of view)". Use `ROT.FOV.PreciseShadowcasting`.
- [ ] **Pathfinding** — A* for smart enemies, Dijkstra maps for swarms. → see **game-systems** § "Pathfinding".
- [ ] **Dungeon generation** — pick BSP, cellular automata, or drunkard's walk; always run a connectivity check. → see **game-systems** § "Dungeon generation".
- [ ] **Speed scheduler (turn loop)** — entities accumulate `energy` by `speed`, act when `energy ≥ 100`. → see **game-loop** § "Pattern B — Turn-based speed scheduler".
- [ ] **Animation queue** — separate sim time from presentation time; ignore input while animating. → see **game-loop** § "Animation layer".
- [ ] **Input → action mapping** — keys/touch/gamepad all go through one `Action` union. → see **game-systems** § "Input → Action mapping".
- [ ] **Save / load with version** — serialize the *whole* `World` + scheduler + RNG state; bump `SAVE_VERSION` on schema changes. → see **game-systems** § "Save / load".
- [ ] **Determinism audit** — same seed → same run, every time. Test it. → see **game-systems** § "Determinism checklist".

If your concept is a **roguelite** (real-time movement, scripted floors, run-resetting meta-progression), the speed scheduler is replaced by the fixed-timestep loop (**game-loop** § "Pattern A"); FOV may not apply; everything else still does.

## Recommended stack

**Vite + TypeScript + PixiJS + rot.js.**

- **Vite + TypeScript** — fast HMR, strict types catch the silent off-by-one bugs the genre is famous for. Non-negotiable.
- **PixiJS** — WebGL renderer that scales past the ~2k entities Canvas 2D dies at; supports both ASCII (bitmap text) and pixel art.
- **rot.js** — battle-tested FOV, A*, dungeon generators, and PRNG written for exactly this genre. Saves weeks of work.

Override only when you have a reason: raw Canvas 2D for learning, Phaser for pixel-art roguelites that need scenes/physics/tweens, KAPLAY for jam scope.

`game-scaffold` will pick this up from `docs/concept.md` and skip its own matrix.

## Loop shape

**Pattern B (turn-based speed scheduler) from `game-loop`.**

The main loop becomes: *wait for input → player acts → run scheduler until player is next → render*. `requestAnimationFrame` still drives the animation layer between logical turns; the sim layer is event-driven, not frame-driven. See **game-loop** § "Pattern B — Turn-based speed scheduler" for the full implementation.

If the concept demands real-time movement (a roguelite), use Pattern A (fixed-timestep accumulator) instead and drop the scheduler.

## Genre-specific pitfalls

- **`Map`/`Set` iteration order in sim.** JS preserves insertion order, but if entities are added in different orders across saves you get divergence. Sort by entity id before iterating in any decision-making system.
- **Unreachable floor tiles.** BSP/cellular gen routinely produces orphaned regions. Always run a BFS connectivity check from a known floor tile and regenerate if any reachable floor is missing — see **game-systems** § "Dungeon generation."
- **Save corruption mid-run.** Roguelikes save *constantly* (often every turn). Wrap save in `try/catch`, write to a scratch key, then atomically rename. Never overwrite the previous save until the new one is verified.
- **Animation gating drops input.** While `isAnimating()` is true, decide once: drop input or queue it. Document the choice. Mixing the two creates ghost moves.
- **Difficulty scaling per depth.** Hand-tuned monster tables per floor outscale procgen ambition fast. Define a depth-keyed `MonsterPool` early; every `generateLevel(depth)` samples from it.
- **Hidden non-determinism.** `Date.now()` in damage rolls, `setTimeout` in AI, `requestAnimationFrame` callback ordering driving sim — all break replays. Audit before shipping a "share your seed" feature.
- **Identification systems.** Unidentified items (potions, scrolls) need a per-run name → real-effect map seeded from the run RNG, not the global RNG, or you leak future runs through save scumming.

## Spec template (write into `docs/concept.md`)

After Phase 5 of `game-concept`, append a `## Roguelike spec` section with:

- **Run shape** — depth count, branches, win condition (e.g., "12 floors linear, retrieve the Amulet on floor 12, escape").
- **Permadeath stance** — pure / one revive / meta-progression (Hades-style).
- **Monster table per depth band** — min/max counts, rarity tiers; can be high-level for now.
- **Item rarities** — common / uncommon / rare / unique; identification on or off.
- **Resource economy** — HP regen rule, hunger/heat/light if any, currency.
- **Meta-progression scope** — none / unlocks / persistent upgrades. Be honest; this is where roguelites overscope.
- **Determinism contract** — is "same seed = same run" a feature? (If yes, spec it visibly.)

## Reference exemplars

- **NetHack** — depth of object interactions; the "rock-paper-scissors with 1000 weapons" benchmark. Steal: emergent system design.
- **Dungeon Crawl Stone Soup (DCSS)** — interface clarity for a deep game; the auto-explore / smart-travel UX is the gold standard. Steal: keybindings + UX.
- **Brogue** — beautiful ASCII, hand-tuned procgen, ranged-attack tactics. Steal: speed-scheduler tuning + readable presentation.
- **ToME (Tales of Maj'Eyal)** — class/talent depth, modern UI on a classic skeleton. Steal: build variety as content.
- **Caves of Qud** — chunk-based world + mutation system. Steal: how worldview ("Science-fantasy desert post-apocalypse") drives every system choice. Most relevant if the user has rich worldview from `game-concept` Phase 1.

## Hand-off

- `game-scaffold` — bootstrap Vite + TS + PixiJS + rot.js with the folder layout already specified.
- `game-loop` — implement Pattern B (speed scheduler) plus the animation layer.
- `game-systems` — wire FOV, pathfinding, dungeon gen, input mapping, save/load, event bus, determinism audit.
- `game-perf` — only after profiling shows a measurable problem (FPS drops with many entities, slow generation, GC pauses).
