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

M6.3 intentionally does not rebalance damage, Rebound, gaps, widths, route cadence or enemy rewards. Those remain deferred until representative content is played end-to-end.

# M7 — Environments / Biomes 🚧
Goal: a run visibly and mechanically progresses through multiple environments.

## M7.1 — Biome Foundation ✅
- run starts in **Teal Ruins**
- completed Climax packets advance the active biome chapter
- generated platforms snapshot their biome identity, preserving visible vertical boundaries instead of recoloring old geometry
- Biome palette is layered beneath Route palette so Treasure / Elite / Rest / Skill remain readable inside each biome
- environment ambience and motes inherit biome identity while Route mood remains a local overlay

## M7.2 — Amber District Vocabulary ✅
- biome-aware encounter decks; Amber favors **Dash Chain / Edge Read / Moving Window** over passive Recovery
- Amber Recovery becomes a light timing-reset packet with **Pulse Gate + Crystal** rather than empty traversal
- Amber Dash Chain uses stronger cross-lane routing and introduces an **Interceptor** in ordinary core play
- Amber Edge Read combines edge commitment with a timed central gate
- Amber Moving Window uses a larger/faster motion profile and lane-denial timing pressure

## M7.3 — Night / Violet Zone ✅
- third chapter after Amber District
- violet/lavender platforms, deep indigo ambience and violet motes
- encounter deck shifts toward **Wall Rescue + Edge Read**, creating constrained routing rather than Amber's speed/cross-lane rhythm
- Moving Window becomes punctuation and Dash Chain is de-emphasized

## M7.4 — Pale Heights 🚧
- fourth chapter after Night / Violet Zone and terminal biome for the current M7 sequence
- pale ice/cyan platform identity with a colder blue ambient wash and bright motes
- gameplay identity deliberately opens space back up after Violet: **Moving Window + Dash Chain** dominate
- Wall Rescue becomes rare; Pale asks for exposed aerial timing and committed transfers instead of tighter corridors
- Route/Skill/Climax cadence and global damage/gap balance remain unchanged

Next M7 slices:
- mobile validation that Violet and Pale are mechanically readable without relying on palette alone
- add bespoke Pale encounter composition if deck weighting alone does not create enough identity
- close M7 only after the four-biome run reads as chapter progression end-to-end

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
- **Rebound Tier 3 overtuned** — currently allows multi-band auto-climbing in low-pressure sections. Revisit after representative content exists; no build should remove the need for sustained player input.
- **Recovery debt** — long runs currently have no meaningful HP sustain. Rest Route should eventually own a recovery contract; exact values are deferred.
- **Crystal progression debt** — Crystal currently has weak collection motivation. Reserve it as a candidate persistent/meta-progression reward rather than inventing a temporary local effect before M9.

## Current status
- M1–M4: complete
- M5 Run Build System: mechanics implemented; balance/option weighting deferred until representative content pressure
- M6.1 Route Node Types: complete
- M6.2 Encounter Deck + Pacing Director: mechanics implemented; cadence/balance deferred
- M6.3 More Enemies / Traversal Threats: complete; mobile playtest pending
- M7.1 Biome Foundation: complete
- M7.2 Amber District: complete; mobile validation pending
- M7.3 Night / Violet Zone: complete; mobile validation pending
- M7.4 Pale Heights: in progress
- M8–M12: not started
