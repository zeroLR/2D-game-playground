# VERTEX PARKOUR — ROADMAP

M1–M4 established the visual, movement, object and Flow foundations. M5+ turns the prototype into a replayable vertical roguelite while keeping balance tuning behind representative content.

# M5 — Run Build System 🚧
Skills, tiers and synergy mechanics are implemented. Remaining work is build-aware option weighting and later balance once the full content vocabulary exists.

# M6 — Route Content + Level Pacing 🚧
Route choices, encounter pacing, phase variants, Climax packets and traversal threats are implemented. Global cadence and numerical balance remain deferred.

## M6.3 — More Enemies / Traversal Threats ✅
- **Patrol Drone** — horizontal patrol obstacle and Dash target
- **Pulse Gate / lane denial** — timed active/inactive passage that asks the player to wait, reroute or commit
- **Interceptor / pursuit** — begins horizontal pursuit only while the player is within its local vertical activation range; Dash can destroy it and preserve existing enemy-kill build interactions
- **Elite composition** — combines Pulse Gate → Interceptor → Patrol Drone / Crystal recovery so each threat role changes the next movement decision
- **Climax composition** — layers timing, pursuit, moving platform, wall recovery and Patrol Drone pressure while retaining a wide Crystal rest exit

# M7 — Environments / Biomes 🚧
Goal: a run visibly and mechanically progresses through multiple environments.

## M7.1 — Biome Foundation ✅
- Teal → Amber → Violet → Pale chapter progression
- generated platforms snapshot biome identity
- Biome palette layers beneath Route palette

## M7.2 — Amber District Vocabulary ✅
- Amber favors Dash Chain / Edge Read / Moving Window
- ordinary packets introduce Pulse Gate and Interceptor machinery
- stronger cross-lane and moving-platform rhythm

## M7.3 — Night / Violet Zone ✅
- violet/lavender palette
- Wall Rescue + Edge Read bias creates constrained routing

## M7.4 — Pale Heights ✅
- pale ice/cyan identity
- Moving Window + Dash Chain bias creates exposed aerial timing

## M7.5 — Biome Ecosystem Identity Pass 🚧
Palette and encounter weighting alone did not make biome transitions readable enough in mobile playtests. Each biome must own recognizable geometry, threat ecology and traversal language.

### Slice A — Teal → Amber vertical slice 🚧
- **Teal Ruins** platforms use irregular/broken ruin slabs rather than a generic uniform deck
- **Amber District** platforms use squared mechanical decks, end brackets and repeating underside machinery marks
- Amber retains its existing machinery ecology: Pulse Gates, Interceptors and more moving platforms
- deterministic tests require Amber to contain more industrial threats and moving machinery than the same-seed Teal run
- acceptance criterion: Teal → Amber should remain recognizable with the progress rail hidden and without relying on palette alone

### Planned ecosystem identities
- **Teal Ruins** — stable broken masonry, Scout/Patrol Drone, readable foundational traversal
- **Amber District** — rails/mechanical decks, Pulse Gate, Interceptor, moving machinery and timing
- **Violet Zone** — constrained/phase-like geometry, pursuit ecology and anomalous barriers
- **Pale Heights** — exposed ice/fragment geometry, environmental pressure, collapse/wind vocabulary

Next M7 slices:
- mobile validate Teal → Amber Slice A
- Slice B: Violet ecosystem geometry + threat identity
- Slice C: Pale ecosystem geometry + environmental threats
- close M7 only when biome identity remains readable without the test rail

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

## Balance / progression debt
- **Rebound Tier 3 overtuned** — revisit after representative content exists
- **Recovery debt** — Rest Route should eventually own HP sustain; exact values deferred
- **Crystal progression debt** — reserve Crystal as a candidate persistent/meta-progression reward for M9

## Current status
- M1–M4: complete
- M5: mechanics implemented; balance deferred
- M6: traversal vocabulary implemented; balance deferred
- M7.1–M7.4: biome progression/content foundation complete
- M7.5 Slice A Teal → Amber ecosystem: in progress
- M8–M12: not started
