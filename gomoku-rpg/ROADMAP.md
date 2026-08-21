# Gomoku RPG — Product Roadmap

## Product direction

A portrait-first, 3–5 minute strategy duel where Gomoku supplies the victory structure and RPG abilities manipulate the board. RPG systems must change placement decisions rather than become a separate HP / ATK combat layer.

Visual direction: abstract characters, minimal premium pixel presentation, restrained HUD, mobile portrait first.

## Current state

M0–M6 established the playable combat loop, hero/build foundation, CPU match setup, replay/history, telemetry, and the current mobile-first visual shell. M7 now owns CPU progression and production polish.

---

## M1 — Combat Foundation ✅
Pattern/Mana economy, one-primary-action turn model, data-driven skills, targeting and combat feedback.

## M2 — Heroes & Builds ✅
Vanguard, Arcanist and Shade vertical slices. Skills manipulate board structure and tempo rather than adding a separate HP/ATK layer.

## M3 — CPU & PvE Foundation ✅
Deterministic heuristic CPU, hero-aware active skills, tactical attack/defense evaluation and shallow candidate search.

## M4 — Meta Progression
Prefer horizontal progression: unlock skills, build a skill pool, limited loadouts and alternative hero play styles. Optional PvE run: Battle → Upgrade → Battle → Elite → Boss.

## M5 — Local PvP
Pass-and-play, hero selection/loadouts, rematch and optional custom rules after PvE rules stabilize.

## M6 — Product UX / Match Lifecycle ✅
CPU match setup, hidden random CPU reveal, battle preview, replay/history, match telemetry, responsive app shell and visual refactor foundation.

---

# M7 — CPU Difficulty & PvE Progression

**Goal:** CPU level is a long-term PvE progression axis, not a cosmetic number. The architecture supports Lv.1–100; every 5 levels forms a measurable strength tier and every 10 levels unlocks a new reasoning capability. Lv.100 is reserved for the terminal computer Boss.

Difficulty must not be implemented as linear brute-force search. Strength is composed from tactical accuracy, pattern knowledge, candidate breadth, selective search, evaluation quality, skill intelligence, combo planning, opponent modeling and controlled decision noise.

### Progression contract

- **Every level:** interpolate bounded decision-quality parameters.
- **Every 5 levels:** enter a new tier with measurable changes to accuracy/search budget/noise. Twenty tiers exist from Lv.1–100.
- **Every 10 levels:** unlock a qualitative CPU capability.
- Forced immediate wins and forced blocks are guardrails, not intentional difficulty mistakes.
- Search depth grows slowly; candidate generation, pruning and tactical extensions carry most late-game strength.
- CPU level remains orthogonal to hero/elite/route/Boss modifiers so Roguelike encounters can compose difficulty without inventing fake levels.

| Level | Capability milestone | Intended qualitative change |
| ---: | --- | --- |
| 1–10 | Immediate tactics | novice → reliable direct win/block |
| 11–20 | Pattern recognition | reads structured multi-direction threats |
| 21–30 | Threat planning | forks, double threats, attack/defense priority |
| 31–40 | Lookahead search | selective short-horizon prediction |
| 41–50 | Skill-aware search | compares placement and skill board outcomes |
| 51–60 | Multi-turn combo | plans placement + skill forced sequences |
| 61–70 | Strategic evaluation | initiative, tempo, resources, global position |
| 71–80 | Opponent modeling | adapts evaluation to observed player tendencies |
| 81–90 | Deep selective search | tactical extensions and stronger pruning |
| 91–99 | Boss-grade policy | near-deterministic high-quality decisions, hero-specialized policy |
| 100 | Apex Boss | complete capability set plus explicit Boss policy hook |

### M7.1 — Pattern Recognition + Candidate Search ✅
Make Lv.4–6 visibly understand board patterns instead of only changing score weights. Candidate generation and tactical ordering become explicit CPU subsystems.

### M7.2 — CPU Decision Telemetry v2 ✅
Persist selected/best score, regret, selection reason, top candidates, score decomposition and CPU context so difficulty can be balanced from evidence rather than match result alone.

### M7.3 — Difficulty Curve Foundation 🚧
Introduce the stable Lv.1–100 difficulty contract without pretending all future intelligence is already implemented.

Foundation deliverables:
- `CPU_LEVEL_MAX = 100`
- 20 five-level tiers
- ten-level capability milestone registry
- bounded interpolation anchors across Lv.1–100
- profile dimensions for tactical accuracy, evaluation quality, combo planning, opponent modeling and decision noise
- preserve existing runtime-compatible fields (`patternDepth`, `searchDepth`, `candidateWidth`, `skillPlanningDepth`, awareness, optimal move rate, blunder tolerance)
- tests for clamping, monotonic progression, tier boundaries and capability unlocks

**M7.3 exit criterion:** level profiles are deterministic, monotonic where required, Lv.1/Lv.20/Lv.50/Lv.100 are observably different configurations, and future CPU systems can query capabilities rather than scattering `level >= N` checks.

### M7.4 — Lv.1–20 Calibration
Make the first progression band real before implementing higher intelligence. Use telemetry and playtests to verify every five-level tier produces a measurable strength change. Lv.20 should reliably understand core Gomoku patterns without requiring deep brute-force search.

### M7.5 — Lv.21–30 Threat Planning
Fork/double-threat recognition, forced-sequence prioritization and attack-vs-defense planning.

### M7.6 — Lv.31–40 Selective Lookahead
Introduce bounded multi-ply search with pruning and tactical extensions. Performance budget is part of acceptance criteria.

### M7.7 — Lv.41–50 Skill-aware Search
Evaluate skill board transformations inside search rather than as isolated heuristic actions.

### M7.8 — Lv.51–60 Combination Planning
Plan multi-turn placement/skill sequences and resource timing.

### M7.9 — Lv.61–70 Strategic Evaluation
Global board pressure, initiative, tempo and Mana/resource opportunity cost.

### M7.10 — Lv.71–80 Opponent Modeling
Build bounded match-local observations of player tendencies and use them as evaluation bias, never hidden rule-breaking information.

### M7.11 — Lv.81–90 Deep Selective Search
Tactical extensions, stronger move ordering/transposition strategy and strict frame/time budgets.

### M7.12 — Lv.91–100 Boss Intelligence
Hero-specialized policies, Boss modifiers/phases and Lv.100 Apex policy. Boss strength should come from richer decision policy and encounter rules, not arbitrary cheating.

---

## M8 — Roguelike PvE Structure

Compose encounter difficulty from `Base CPU Level + Route/Elite/Hero/Boss modifiers`. Target run structure remains Battle → Upgrade → Battle → Upgrade → Elite → Upgrade → Boss. Permanent progression should remain primarily horizontal so board-game decisions stay meaningful.

## M9 — Polish & Release
Placement impact, Mana/skill feedback, threat warning, winning-line presentation, hero reactions, haptics, audio, transitions, onboarding and accessibility/reduced-motion support.

---

## Product gates

| Stage | Question |
| --- | --- |
| Combat | Is RPG Gomoku more interesting than normal Gomoku? |
| CPU progression | Do 5-level tiers measure stronger play and 10-level milestones feel smarter rather than merely slower? |
| Roguelike | Do route/build choices let players overcome stronger CPU policies? |
| Boss | Does Lv.100 feel like an intelligent terminal encounter rather than a cheating CPU? |
| Release | Is the validated game worth operating as a service? |

## Deferred until validated

- Bulwark / Seal re-evaluation after richer hostile skill policies
- online matchmaking / ranked seasons
- account system
- equipment ATK/DEF stat creep
- large hero roster

The roadmap advances through playtest and telemetry evidence, not feature count.
