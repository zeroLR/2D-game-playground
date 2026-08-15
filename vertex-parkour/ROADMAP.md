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
Implemented:
- deterministic weighted encounter decks
- **Warmup** phase biases Recovery / Dash Chain and suppresses harder traversal patterns
- **Flow** phase broadens encounter variety
- **Pressure** phase biases Moving Window / Wall Rescue / Edge Read / Dash Chain
- core encounter anti-repeat guard prevents three identical encounter families in succession
- Skill / Route choices remain bounded cadence interrupts rather than random deck draws
- queued Route content remains authoritative over the director
- phase-aware family variants make Warmup more forgiving and Pressure more threat-dense without globally increasing vertical gaps
- **Climax / Pressure Peak** packet recurs after sustained Pressure play, combining Drone routing, Moving Window, Hazard, Wall recovery, and a Crystal rest exit
- Climax scheduling counts core encounters rather than raw bands, so Skill/Route interruptions do not distort pressure cadence

Remaining M6.2:
- tune Skill / Route / Climax spacing from mobile playtests
- evaluate gap/width pressure and Rebound Tier 3 only after the full pacing loop is played end-to-end

## M6.3 — More Enemies / Traversal Threats ✅
Threats primarily force movement decisions rather than creating stationary combat encounters.

Implemented threat vocabulary:
- **Patrol Drone** — sweeps horizontally around its authored lane; visual and collision positions are identical
- **Pulse Gate / lane-denial** — periodically closes a vertical lane, creating readable timing windows without chasing the player
- **Interceptor / pursuit** — begins horizontal pursuit only while the player is within its local vertical activation range; Dash can destroy it and preserve existing enemy-kill build interactions
- **Elite composition** — combines Pulse Gate → Interceptor → Patrol Drone / Crystal recovery so each threat role changes the next movement decision
- **Climax composition** — layers timing, pursuit, moving platform, wall recovery and Patrol Drone pressure while retaining a wide Crystal rest exit

M6.3 intentionally does not rebalance damage, Rebound, gaps, widths, route cadence or enemy rewards. Those remain deferred until representative content is played end-to-end.

# M7 — Environments / Biomes 🚧
Goal: a run visibly and mechanically progresses through multiple environments.

## M7.1 — Biome Foundation ✅
- run starts in **Teal Ruins**
- first completed Climax hands off into **Amber District**
- generated platforms snapshot their biome identity, preserving a visible vertical boundary instead of recoloring old geometry
- Biome palette is layered beneath Route palette so Treasure / Elite / Rest / Skill remain readable inside each biome
- environment ambience and motes inherit biome identity while Route mood remains a local overlay

## M7.2 — Biome Encounter Vocabulary 🚧
Implemented Amber identity:
- biome-aware encounter decks; Amber favors **Dash Chain / Edge Read / Moving Window** over passive Recovery
- Amber Recovery becomes a light timing-reset packet with **Pulse Gate + Crystal** rather than empty traversal
- Amber Dash Chain uses stronger cross-lane routing and introduces an **Interceptor** in ordinary core play
- Amber Edge Read combines edge commitment with a timed central gate
- Amber Moving Window uses a larger/faster motion profile and lane-denial timing pressure
- Skill / Route / Climax cadence and global damage/gap balance remain unchanged

Next M7 slices:
- mobile validation that Amber feels mechanically distinct without becoming precision punishment
- add **Night / Violet Zone** with its own encounter vocabulary
- add **Ice / Pale Heights** after Violet identity is validated

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
- M6.2 Encounter Deck + Pacing Director: mechanics implemented; cadence/balance deferred
- M6.3 More Enemies / Traversal Threats: complete; mobile playtest pending
- M7.1 Biome Foundation: complete; Teal Ruins → Amber District handoff implemented
- M7.2 Biome Encounter Vocabulary: in progress; Amber gameplay identity implemented
- M8–M12: not started
