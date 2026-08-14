# VERTEX MVP Roadmap

VERTEX is a mobile-portrait parkour roguelite. The product vision is **fast-paced vertical climbing + run-based build decisions + long-term mastery**, while preserving a restrained visual style and direct touch-first controls.

## Product pillars
1. **Movement first** — climbing, Dash, recovery, and Flow must remain intrinsically fun before progression systems are layered on top.
2. **Build through motion** — whenever possible, choices should be made by moving through the world rather than opening modal menus.
3. **Run-local power, meta-level expression** — Skills and Relics shape a single run; Talents and Characters shape what kinds of runs are possible.
4. **Readable risk/reward routing** — Treasure, Elite, Rest, and special routes should be understandable before commitment.
5. **Low-fatigue presentation** — visual escalation should communicate speed and state without turning the screen into constant VFX noise.

## Core product loop
`Select Character → Start Climb → Traverse Encounters → Choose Routes → Gain Skills / Relics → Build Synergies → Survive Biome Escalation → Abyss / Run Climax → Run Summary → Meta Progression / Unlocks → Next Climb`

## M1 — Visual Foundation ✅
Runtime gameplay resembles the approved concept direction. Passed mobile screenshot review.

## M2 — Parkour Feel ✅
World-space vertical physics, reachable procedural spacing, auto jump, asymmetric gravity, variable Dash, landing tolerance, spring camera with downward recovery, restrained impact feedback.

## M3 — Gameplay Objects ✅
Airborne Dash resource, Air Nudge, Wall Catch / Jump, edge Spikes, authored encounters, Moving Platform shortcuts, pursuing liquid Abyss.

## M4 — Flow System ✅
Chain grace + decay, four Flow tiers, wake/environment feedback, restrained high-tier transition, high-Flow mistake recovery.

# M5 — Run Build System 🚧
Goal: each climb develops a distinct build while movement remains uninterrupted.

## M5.1 — Route Choice Foundation ✅
Bounded in-world upgrade splits, readable commitment, sibling locking, safe rejoin, deterministic generation.

## M5.2 — Skill Pool + Level Up ✅
- **Phase Dash / Dash** — Dash velocity scaling
- **Rebound / Jump** — landing jump scaling
- **Kill Refund / Kill** — Drone kill Flow scaling
- **Continuity / Flow** — Flow grace scaling
- deterministic two-skill choices, distinct glyph language, Tier 3 cap

## M5.3 — Build Synergy + Skill Tiers 🚧
Current slice:
- **Momentum Loop** — Phase Dash + Continuity; Dash grants additional Flow
- **Predator Rhythm** — Kill Refund + Rebound; Drone kill empowers the next landing jump

Remaining: build-aware option weighting, compact build HUD only if needed, additional synergies after route pressure makes them meaningful.

# M6 — Route Content + Level Pacing 🚧
Goal: route selection determines **what kind of challenge/reward comes next**, not only which Skill is collected.

## M6.1 — Route Node Types ✅
- **Treasure** — lower-pressure Crystal reward segment
- **Elite** — Drone + hazard traversal segment
- **Rest** — wide recovery section
- **Skill / Level Up** — routes into build decision
- route collision queues the selected content into future world generation

## M6.2 — Encounter Deck + Pacing Director 🚧
Implemented first director slice:
- deterministic weighted encounter decks
- **Warmup** phase biases Recovery / Dash Chain and suppresses harder traversal patterns
- **Flow** phase broadens encounter variety
- **Pressure** phase biases Moving Window / Wall Rescue / Edge Read / Dash Chain
- core encounter anti-repeat guard prevents three identical encounter families in succession
- Skill / Route choices remain bounded cadence interrupts rather than random deck draws
- queued Route content remains authoritative over the director

Remaining M6.2:
- pressure-aware encounter variants within each family
- explicit climax packet before biome transition
- tune special/choice spacing from mobile playtests
- evaluate gap/width pressure only after encounter composition is readable

## M6.3 — More Enemies / Traversal Threats
Threats should primarily force movement decisions. Elite enemies alter route planning rather than becoming stationary HP sponges; combat remains secondary to traversal.

# M7 — Environments / Biomes
Goal: a run visibly and mechanically progresses through multiple environments.
Initial directions: Teal Ruins / Vertical City, Sunset / Amber District, Night / Violet Zone, Ice / Pale Heights. Each biome needs unique composition/palette plus encounter or hazard vocabulary shift; avoid cosmetic-only recolors.

# M8 — Relic System
Rare run-defining rule modifiers acquired through Elite/Treasure/Special routes; avoid another list of small percentage stats.

# M9 — Meta Progression + Talent Tree
Unlock Skills, Relics, starting options, route/biome variants and limited QoL. Avoid large permanent raw-stat inflation.

# M10 — Character System
Characters create distinct starting identities/build biases while sharing core controls: Nova (Dash), Kai (Kill/aggressive routing), Lumen (Flow/control).

# M11 — Run Summary + Product Loop
Score, duration, Flow peak, enemies defeated, Skills, Relics, biome/route progress, damage taken, persistent reward.

# M12 — MVP Vertical Slice
One complete replayable 5–10 minute run: onboarding → Skill → route choice → Elite/Treasure contrast → build decision → high Flow → biome escalation → Abyss chase → escape/death → summary.

## Balance debt
- **Rebound Tier 3 overtuned** — currently allows multi-band auto-climbing in low-pressure sections. Revisit after representative M6 enemy/hazard density exists; no build should remove the need for sustained player input.

## Current status
- M1–M4: complete
- M5 Run Build System: mechanics implemented; balance/option weighting deferred until representative content pressure
- M6.1 Route Node Types: complete
- M6.2 Encounter Deck + Pacing Director: in progress
- M6.3 More Enemies / Traversal Threats: not started
- M7–M12: not started
