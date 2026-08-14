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
Select Character
  → Start Climb
  → Traverse Encounters
  → Choose Routes
  → Gain Skills / Relics
  → Build Synergies
  → Survive Biome Escalation
  → Abyss / Run Climax
  → Run Summary
  → Meta Progression / Unlocks
  → Next Climb
```

---

## M1 — Visual Foundation ✅

Goal: runtime gameplay should clearly resemble the approved concept direction even in a static screenshot.

Status: passed mobile screenshot review on 2026-08-12.

## M2 — Parkour Feel ✅

Goal: movement itself becomes the primary source of fun.

Delivered:
- world-space vertical velocity and gravity
- reachable procedural platform spacing
- auto jump with short landing compression
- asymmetric rise / apex / fall gravity
- variable-strength velocity Dash controlled by swipe distance
- forgiving platform landing tolerance
- spring camera with upward dead-zone follow plus downward recovery follow
- restrained landing / impact feedback

Status: passed mobile playtest feedback on 2026-08-12; downward camera recovery later fixed large-fall visibility without changing normal upward framing.

## M3 — Gameplay Objects ✅

Goal: world objects create traversal decisions instead of only dealing damage.

Delivered:
- single airborne Dash resource, restored by landing / Crystal / Drone routing
- Air Nudge for fine correction
- Wall Catch / Wall Jump recovery route
- forgiving edge Spike terrain
- authored four-band encounter families
- optional Moving Platform shortcut encounters
- world-space pursuing Abyss with liquid presentation

Status: traversal-object loop validated in mobile playtests.

## M4 — Flow System ✅

Goal: Flow becomes a felt gameplay state rather than a HUD number.

Delivered:
- chain grace + decay
- Calm → Engaged → Rush → Overdrive tiers
- player wake / aura and environmental speed feedback
- restrained high-tier palette / momentum transition
- high-Flow mistake recovery: Rush falls to 3x, Overdrive falls to 5x instead of always resetting to 1x
- no Flow-dependent movement-physics changes

Status: mobile playtests confirmed that Flow is readable and useful without destabilizing controls.

---

# M5 — Run Build System 🚧

Goal: each climb develops a distinct build while movement remains uninterrupted.

## M5.1 — Route Choice Foundation ✅

Current implementation:
- every bounded interval, generate an in-world upgrade split
- left / right routes telegraph the upgrade before commitment
- collecting one option locks the sibling choice
- both routes safely rejoin
- no modal or pause screen
- deterministic generation

Current prototype upgrades:
- **Impulse / Dash** — Dash velocity increase
- **Continuity / Flow** — longer Flow grace

Status: mobile playtest confirmed the left Dash / right Flow choice is readable and intuitive.

## M5.2 — Skill Pool + Level Up

Goal: replace repetitive Dash-vs-Flow stacking with a genuine run-local skill build.

Planned archetypes:
- **Dash** — Phase Dash, Dash Refund, Afterimage, stronger resource interactions
- **Jump** — apex control, landing rebound, recovery-oriented jump mutations
- **Kill** — Drone interaction, kill refund, kill-triggered mobility effects
- **Flow** — chain sustain, Flow conversion, high-tier interactions
- **Special** — rare cross-archetype rule changes

Rules:
- Skills are **run-local** and disappear when the run ends
- each Level Up presents a small set of distinct options
- upgrades should change traversal rules or routing decisions, not only add flat percentages
- repeated acquisition may upgrade a Skill tier rather than duplicate identical text forever
- the build should be readable from a compact run HUD / icon strip

Validation target:
- two runs with different Skill choices should feel meaningfully different within 30–60 seconds
- players can identify the build direction without opening an inventory screen

## M5.3 — Build Synergy + Skill Tiers

Goal: make Skills combine into recognizable playstyles.

Scope:
- Skill tiers / stacking limits
- prerequisite or affinity rules where useful
- archetype synergy bonuses
- build-aware option weighting
- avoid dead choices that do not interact with the current run

Example build identities:
- Dash chaining
- Flow sustain
- Drone kill routing
- recovery / wall mobility

---

# M6 — Route Content + Level Pacing

Goal: route selection determines **what kind of challenge/reward comes next**, not only which Skill is collected.

## M6.1 — Route Node Types

Introduce world-readable route content based on the original concept:

- **Treasure** — lower combat pressure, reward currency / items / Skill opportunity
- **Elite** — harder traversal / enemy pattern, high-value reward
- **Rest** — recovery-oriented safe section, HP / resource recovery
- **Skill / Level Up** — build decision route
- **Special** — rare event or unusual rule set

Key distinction:

> Route Choice decides **what happens next**. Level Up decides **how the current build evolves**.

The two systems should coexist instead of being collapsed into one Dash-vs-Flow split.

## M6.2 — Encounter Deck + Pacing Director

Goal: replace flat random probabilities with controlled run pacing.

Scope:
- encounter decks / weighted phases
- minimum and maximum spacing by encounter family
- tutorial → variety → pressure → climax pacing
- bounded frequency for Moving Platform, Wall Rescue, Elite, Treasure, and choice events
- deterministic sequence reproduction for playtests

Known issue addressed here:
- special encounters such as Moving Platform currently appear too sparsely in practical playtests.

## M6.3 — More Enemies / Traversal Threats

Expand from the current Drone / Spike / hazard vocabulary.

Direction:
- threats should primarily force movement decisions
- Elite enemies should alter route planning rather than become stationary HP sponges
- combat remains secondary to traversal

---

# M7 — Environments / Biomes

Goal: a run visibly and mechanically progresses through multiple environments.

Initial biome direction derived from the concept art:
- **Teal Ruins / Vertical City** — current baseline environment
- **Sunset / Amber District** — warmer palette, longer silhouette readability, alternate platform patterns
- **Night / Violet Zone** — darker palette, stronger Flow / hazard contrast
- **Ice / Pale Heights** — cold palette, sharper geometry and distinct traversal modifiers

Each biome should provide:
- unique background composition and palette
- a small encounter / hazard vocabulary shift
- its own pacing emphasis
- clear transition without visual fatigue

Avoid making biomes cosmetic-only recolors.

---

# M8 — Relic System

Goal: add rare run-defining rule modifiers distinct from normal Skills.

Relic principles:
- **run-local** like Skills, but much rarer
- lower quantity, higher rule impact
- often cross-archetype
- obtained through Elite / Treasure / Special routes rather than normal Level Up cadence

Examples of intended design space:
- Crystal also refreshes another traversal resource
- first hit at Overdrive preserves an additional Flow threshold
- Wall Jump changes the next Dash behavior
- Drone kills alter nearby platform or Crystal rewards

Relics should not become another list of `+10%` stats.

---

# M9 — Meta Progression + Talent Tree

Goal: provide long-term progression without invalidating run skill.

## M9.1 — Talent Tree

Talents persist across runs.

Preferred unlock types:
- unlock new Skills into the run pool
- unlock new Relics
- unlock alternate starting options
- unlock route / biome variants
- improve choice quality or information
- limited quality-of-life progression

Avoid large permanent raw-stat inflation that makes early runs obsolete.

Concept hierarchy:

```text
Talent Tree (persistent)
  → unlocks possibilities
  → Skill / Relic pool expands
  → individual runs remain build-driven
```

## M9.2 — Meta Currency

Scope:
- one initial persistent resource
- earned from completed / failed runs via clear rules
- spent primarily on unlocks rather than mandatory stat grinding

---

# M10 — Character System

Goal: multiple characters create distinct starting identities and build biases.

Concept roster:
- **Nova** — Dash-oriented identity
- **Kai** — Kill / aggressive routing identity
- **Lumen** — Flow / control identity

Character design rules:
- not cosmetic-only skins
- each character has a small starting rule difference or signature passive
- characters should bias a build without hard-locking archetypes
- shared core controls remain identical

Scope:
- character select screen
- unlock conditions
- compact character identity / passive description
- character-specific visual treatment while preserving overall art direction

---

# M11 — Run Summary + Product Loop

Goal: complete the transition from isolated prototype run to repeatable roguelite product loop.

Run Summary should include:
- score
- run duration
- Flow peak
- enemies defeated
- Skills acquired
- Relics acquired
- biome / route progress
- damage taken
- persistent reward earned

Loop:

```text
Death / Escape
  → Run Summary
  → Meta Reward
  → Talent / Character Unlock Progress
  → Character Select / Start Climb
```

---

# M12 — MVP Vertical Slice

Goal: one complete, replayable run that demonstrates the full product promise.

Target first complete run: approximately 5–10 minutes.

Suggested pacing:
- 0:00 movement onboarding
- 0:45 first Skill / Level Up
- 1:30 first meaningful route choice
- 2:00 Elite / Treasure contrast
- 2:30 second build decision
- 3:30 high-Flow section
- 4:00 biome / pacing escalation
- 4:30 Abyss pressure / chase
- 5:00+ escape, death, or extended climb depending on final run format

The first climax should remain an **Abyss chase**, not a stationary boss fight.

Definition of done:
- movement remains fun without progression rewards
- each run develops a recognizable build
- route choices visibly alter risk / reward
- at least two environments are distinguishable mechanically and visually
- at least one Relic can meaningfully alter a run
- Run Summary closes the loop into persistent progression

---

## Scope boundary

Not required before the first complete vertical slice unless validation shows they are essential:
- large inventory systems
- shops with complex economy
- dozens of characters
- huge Talent Tree
- account / cloud progression
- live-service systems
- battle pass / monetization

## Current status

- M1 Visual Foundation: complete
- M2 Parkour Feel: complete
- M3 Gameplay Objects: complete
- M4 Flow System: complete
- M5 Run Build System: in progress
  - M5.1 Route Choice Foundation: implemented and mobile-validated
  - M5.2 Skill Pool + Level Up: next
- M6 Route Content + Level Pacing: not started
- M7 Environments / Biomes: not started
- M8 Relic System: not started
- M9 Meta Progression + Talent Tree: not started
- M10 Character System: not started
- M11 Run Summary + Product Loop: not started
- M12 MVP Vertical Slice: not started
