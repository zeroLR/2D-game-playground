# VERTEX PARKOUR — ROADMAP

M1–M4 established the visual, movement, object and Flow foundations. M5+ turns the prototype into a replayable vertical roguelite while keeping balance tuning behind representative content.

# M5 — Run Build System 🚧
Skills, tiers and synergy mechanics are implemented. Remaining work is build-aware option weighting and later balance once the full content vocabulary exists.

# M6 — Route Content + Level Pacing 🚧
Route choices, encounter pacing, phase variants, Climax packets and traversal threats are implemented. Global cadence and numerical balance remain deferred.

## M6.3 — More Enemies / Traversal Threats ✅
- Patrol Drone, Pulse Gate and Interceptor traversal threats
- Elite and Climax mixed-mechanic composition

# M7 — Environments / Biomes / Chapter Shell 🚧
Goal: a run visibly and mechanically progresses through multiple environments, reaches a defined Chapter 1 endpoint, and is framed by a coherent game shell.

## M7.1–M7.4 — Biome progression ✅
- Teal Ruins → Amber District → Violet Zone → Pale Heights
- generated entities snapshot biome identity
- Biome palette layers beneath Route palette

## M7.5 — Biome Ecosystem Identity Pass ✅ first-pass
- Teal: broken ruin slabs / foundational traversal
- Amber: industrial decks / timing machinery
- Violet: fragmented traversal / pursuit ecology
- Pale: moving ice floes / wind corridors / collapsing ice

## M7.6 — Storm Crown / Chapter 1 Endgame ✅ first-pass
- Storm Crown is the terminal Chapter 1 biome and remixes prior traversal vocabulary
- Storm Surge is its signature sustained environmental pressure
- explicit RunPhase state: `running → final-climax → final-ascent → chapter-clear`
- first Storm Crown Climax becomes the terminal procedural Climax
- authored Final Ascent takes over after procedural generation locks
- Summit landing is the explicit Chapter 1 clear condition
- clear state stops gameplay pressure and provides first-pass completion presentation

## M7.7 — Game Hub / Product Shell 🚧
Build a complete shell around the playable chapter while leaving future progression systems clearly marked as prototypes.

- **Home / Start Menu** — branded entry point, resume active ascent, access all game areas
- **Character Profile** — Nova current runner profile; Kai/Lumen future M10 previews only
- **Talent Matrix (mock)** — node/tree presentation shell reserved for M9 persistent progression
- **Ascension Gate** — Chapter 1 route preview and actual gameplay entry/restart point
- **Relic Archive (mock)** — loadout/collection language reserved for M8 relic mechanics
- **Settings** — local shell preferences and control reference
- Hub pauses Pixi gameplay while open; gameplay resumes only when returning to the run
- visual language must remain consistent with VERTEX: dark atmospheric field, fine geometry, restrained teal/gold/violet accents, low-noise typography

### M7.7 Slice B — Chapter lifecycle transitions ✅ first-pass
- Gate commit now plays a short Chapter 01 / The Ascent transition before gameplay input/time begins
- restarting an active chapter preserves the transition across the reload boundary
- Summit clear emits a product-shell completion event once, freezes gameplay, plays a Storm Crown clear transition, then returns to Home
- reduced-motion preference collapses transition timings instead of forcing cinematic motion

## M7.8 — Core Build Identity 🚧
Clarify the core run mechanics before adding Relics so later systems modify a stable vocabulary.

### M7.8A — Flow Identity ✅ first-pass
- Flow is a bounded `1 → 12` momentum meter, not a literal movement-speed multiplier
- tiers remain Calm `1–2.99`, Engaged `3–5.99`, Rush `6–8.99`, Overdrive `9–12`
- higher tiers improve movement **feel** through air-control authority and shorter landing recovery without increasing base jump height
- tier movement modifiers: Engaged `+4% air / 6% faster recovery`, Rush `+8% / 14%`, Overdrive `+12% / 24%`
- `12` is explicitly **Perfect Flow**, a detectable ceiling/state for later Skill/Relic rule hooks rather than an endlessly scaling stat
- Flow continues to reward score and retain the existing grace/decay/mistake model

### M7.8B — Skill Vocabulary Expansion ⏭
Expand the current four-skill prototype into a representative Dash / Jump / Kill / Flow vocabulary before Relics.

### M7.8C — Build Synergy Pass ⏭
Add cross-archetype interactions after the expanded skill vocabulary exists.

# M8 — Relic System
Rare run-defining rule modifiers acquired through Elite/Treasure/Special routes; avoid another list of small percentage stats. The M7.7 Relic Archive is presentation-only until this milestone.

# M9 — Meta Progression + Talent Tree
Unlock Skills, Relics, starting options, route/biome variants and limited QoL. Avoid large permanent raw-stat inflation. The M7.7 Talent Matrix is presentation-only until this milestone.

# M10 — Character System
Characters create distinct starting identities/build biases while sharing core controls: Nova (Dash), Kai (Kill/aggressive routing), Lumen (Flow/control). M7.7 exposes their shell but only Nova maps to current gameplay.

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
- M7.1–M7.6: first-pass Chapter 1 gameplay loop complete
- M7.7: Game Hub/product shell in progress; Chapter lifecycle transition first-pass complete
- M7.8A: Flow identity first-pass complete
- M7.8B–C: not started
- M8–M12: not started
