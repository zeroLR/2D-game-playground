# VERTEX MVP Roadmap

VERTEX is a mobile-portrait parkour roguelite. The product vision is **fast-paced vertical climbing + run-based build decisions + long-term mastery**, while preserving a restrained visual style and direct touch-first controls.

## Product pillars

1. **Movement first** — climbing, Dash, recovery, and Flow must remain intrinsically fun before progression systems are layered on top.
2. **Build through motion** — whenever possible, choices should be made by moving through the world rather than opening modal menus.
3. **Run-local power, meta-level expression** — Skills and Relics shape a single run; Talents and Characters shape what kinds of runs are possible.
4. **Readable risk/reward routing** — Treasure, Elite, Rest, and special routes should be understandable before commitment.
5. **Low-fatigue presentation** — visual escalation should communicate speed and state without turning the screen into constant VFX noise.

## Core product loop

```text
Select Character → Start Climb → Traverse Encounters → Choose Routes → Gain Skills / Relics → Build Synergies → Survive Biome Escalation → Abyss / Run Climax → Run Summary → Meta Progression / Unlocks → Next Climb
```

---

## M1 — Visual Foundation ✅
Goal: runtime gameplay should clearly resemble the approved concept direction even in a static screenshot.
Status: passed mobile screenshot review on 2026-08-12.

## M2 — Parkour Feel ✅
Goal: movement itself becomes the primary source of fun.
Delivered: world-space vertical physics, reachable procedural spacing, auto jump, asymmetric gravity, variable Dash, landing tolerance, spring camera with downward recovery, restrained impact feedback.
Status: passed mobile playtests.

## M3 — Gameplay Objects ✅
Goal: world objects create traversal decisions instead of only dealing damage.
Delivered: airborne Dash resource, Air Nudge, Wall Catch / Jump, edge Spikes, authored encounters, Moving Platform shortcuts, pursuing liquid Abyss.
Status: traversal-object loop validated in mobile playtests.

## M4 — Flow System ✅
Goal: Flow becomes a felt gameplay state rather than a HUD number.
Delivered: chain grace + decay, four Flow tiers, wake/environment feedback, restrained high-tier transition, high-Flow mistake recovery.
Status: mobile playtests confirmed Flow is readable and useful without destabilizing controls.

---

# M5 — Run Build System 🚧
Goal: each climb develops a distinct build while movement remains uninterrupted.

## M5.1 — Route Choice Foundation ✅
- bounded in-world upgrade splits
- readable left/right commitment
- sibling choice locking
- safe rejoin
- no modal/pause
- deterministic generation

Status: mobile playtest confirmed route-choice UX is intuitive.

## M5.2 — Skill Pool + Level Up ✅

Implemented initial run-local pool:
- **Phase Dash / Dash** — Dash velocity scaling
- **Rebound / Jump** — landing jump scaling
- **Kill Refund / Kill** — Drone kill Flow scaling
- **Continuity / Flow** — Flow grace scaling
- deterministic two-skill choices
- distinct archetype glyph/color language
- Tier 3 cap

Status: mobile playtest confirmed different choices are readable. Rebound is intentionally flagged as overtuned: at Tier 3 its vertical reach can skip several platform bands and reduce required input in the current low-pressure encounter set. Balance is deferred until M6 enemies/hazards/pacing provide representative pressure.

## M5.3 — Build Synergy + Skill Tiers 🚧

Goal: make combinations form recognizable playstyles rather than four independent stat tracks.

Current slice:
- **Momentum Loop** — Phase Dash + Continuity; Dash grants additional Flow
- **Predator Rhythm** — Kill Refund + Rebound; Drone kill empowers the next landing jump
- synergy activation is automatic from the run build; no extra menu interaction
- transient synergy effects reset naturally when consumed / run resets

Next validation:
- synergy should be noticeable during normal traversal without requiring HUD inspection
- combined effects should create route preferences (Dash chaining vs Drone routing)
- avoid amplifying Rebound further until M6 pressure exists

Remaining M5.3 scope:
- build-aware option weighting / avoid capped or dead choices
- compact build/synergy HUD if playtests show memory load is becoming a problem
- additional synergies only after the first two demonstrate distinct routing behavior

---

# M6 — Route Content + Level Pacing
Goal: route selection determines **what kind of challenge/reward comes next**, not only which Skill is collected.

## M6.1 — Route Node Types
- **Treasure** — lower pressure, reward currency/items/Skill opportunity
- **Elite** — harder traversal/enemy pattern, high-value reward
- **Rest** — safe recovery section
- **Skill / Level Up** — build decision route
- **Special** — rare event or unusual rules

> Route Choice decides **what happens next**. Level Up decides **how the current build evolves**.

## M6.2 — Encounter Deck + Pacing Director
- encounter decks / weighted phases
- min/max spacing by family
- tutorial → variety → pressure → climax pacing
- bounded Moving Platform / Wall Rescue / Elite / Treasure / choice frequency
- deterministic reproduction

Known issue: special encounters currently appear too sparsely in practical playtests.

## M6.3 — More Enemies / Traversal Threats
Threats should primarily force movement decisions. Elite enemies alter route planning rather than becoming stationary HP sponges; combat remains secondary to traversal.

---

# M7 — Environments / Biomes
Goal: a run visibly and mechanically progresses through multiple environments.

Initial directions:
- **Teal Ruins / Vertical City** — baseline
- **Sunset / Amber District** — warm palette and alternate platform patterns
- **Night / Violet Zone** — stronger Flow/hazard contrast
- **Ice / Pale Heights** — cold palette, sharper geometry, traversal modifiers

Each biome needs unique background composition/palette, encounter or hazard vocabulary shift, pacing emphasis, and readable transition. Avoid cosmetic-only recolors.

---

# M8 — Relic System
Goal: rare run-defining rule modifiers distinct from normal Skills.

Principles: run-local, rare, high-impact, often cross-archetype, acquired through Elite/Treasure/Special routes. Relics should not become another list of `+10%` stats.

---

# M9 — Meta Progression + Talent Tree
Goal: long-term progression without invalidating run skill.

## M9.1 — Talent Tree
Prefer unlocking Skills, Relics, starting options, route/biome variants, choice information, and limited QoL. Avoid large permanent raw-stat inflation.

## M9.2 — Meta Currency
One initial persistent resource earned from runs and spent primarily on unlocks rather than mandatory stat grinding.

---

# M10 — Character System
Goal: characters create distinct starting identities/build biases.
- **Nova** — Dash
- **Kai** — Kill/aggressive routing
- **Lumen** — Flow/control

Characters are not cosmetic-only; shared core controls remain identical.

---

# M11 — Run Summary + Product Loop
Run Summary: score, duration, Flow peak, enemies defeated, Skills, Relics, biome/route progress, damage taken, persistent reward.

`Death / Escape → Run Summary → Meta Reward → Talent / Character Unlock Progress → Character Select / Start Climb`

---

# M12 — MVP Vertical Slice
Goal: one complete replayable 5–10 minute run demonstrating the full promise.

Suggested pacing: movement onboarding → first Skill → meaningful route choice → Elite/Treasure contrast → second build decision → high Flow → biome escalation → Abyss chase → escape/death/extended climb.

Definition of done:
- movement remains fun without progression rewards
- each run develops a recognizable build
- route choices alter risk/reward
- at least two environments differ mechanically and visually
- at least one Relic meaningfully alters a run
- Run Summary closes into persistent progression

---

## Balance debt
- **Rebound Tier 3 overtuned** — currently allows multi-band auto-climbing in low-pressure sections. Revisit during M6 after representative enemy/hazard density exists; guardrail is that no build should remove the need for sustained player input.

## Scope boundary
Not required before the first vertical slice unless validation demands it: large inventory, complex shops/economy, dozens of characters, huge Talent Tree, account/cloud progression, live-service systems, monetization.

## Current status
- M1 Visual Foundation: complete
- M2 Parkour Feel: complete
- M3 Gameplay Objects: complete
- M4 Flow System: complete
- M5 Run Build System: in progress
  - M5.1 Route Choice Foundation: complete
  - M5.2 Skill Pool + Level Up: implemented and mobile-validated
  - M5.3 Build Synergy + Skill Tiers: in progress
- M6 Route Content + Level Pacing: not started
- M7 Environments / Biomes: not started
- M8 Relic System: not started
- M9 Meta Progression + Talent Tree: not started
- M10 Character System: not started
- M11 Run Summary + Product Loop: not started
- M12 MVP Vertical Slice: not started
