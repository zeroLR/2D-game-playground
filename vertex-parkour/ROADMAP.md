# VERTEX PARKOUR — ROADMAP

M1–M4 established the visual, movement, object and Flow foundations. M5+ turns the prototype into a replayable vertical roguelite while keeping balance tuning behind representative content.

# M5 — Run Build System 🚧
Skills, tiers and synergy mechanics are implemented. Remaining work is build-aware option weighting and later balance once the full content vocabulary exists.

# M6 — Route Content + Level Pacing 🚧
Route choices, encounter pacing, phase variants, Climax packets and traversal threats are implemented. Global cadence and numerical balance remain deferred.

## M6.3 — More Enemies / Traversal Threats ✅
- Patrol Drone, Pulse Gate and Interceptor traversal threats
- Elite and Climax mixed-mechanic composition

# M7 — Environments / Biomes 🚧
Goal: a run visibly and mechanically progresses through multiple environments and reaches a defined Chapter 1 endpoint.

## M7.1–M7.4 — Biome progression ✅
- Teal Ruins → Amber District → Violet Zone → Pale Heights
- generated entities snapshot biome identity
- Biome palette layers beneath Route palette

## M7.5 — Biome Ecosystem Identity Pass ✅ first-pass
- Teal: broken ruin slabs / foundational traversal
- Amber: industrial decks / timing machinery
- Violet: fragmented traversal / pursuit ecology
- Pale: moving ice floes / wind corridors / collapsing ice

## M7.6 — Storm Crown / Chapter 1 Endgame 🚧
- Storm Crown is the terminal Chapter 1 biome and remixes prior traversal vocabulary
- Storm Surge is its signature sustained environmental pressure

### Slice 3A — End Condition Architecture 🚧
- introduce explicit RunPhase state: `running → final-climax → final-ascent → chapter-clear`
- the first Storm Crown Climax becomes the terminal procedural Climax
- after that Climax completes, ordinary procedural world generation stops
- expose `final-ascent` as the handoff point for the authored endgame sequence
- expose a guarded `markChapterClear()` contract for the future Summit / chapter-exit landing
- reset returns the run to normal procedural generation

Next M7.6 slices:
- **3B Final Climax / Final Ascent Set Piece** — authored endgame traversal after procedural generation locks
- **3C Summit + Chapter Clear** — chapter-exit entity, landing detection, clear presentation and run handoff

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
- M7.1–M7.5: first-pass biome progression/ecosystem implemented
- M7.6 Storm Crown: foundation + Storm Surge implemented; Chapter 1 end condition in progress
- M8–M12: not started
