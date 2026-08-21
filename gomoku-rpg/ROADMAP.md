# Gomoku RPG — Product Roadmap

## Product direction

A portrait-first strategy RPG where Gomoku supplies the victory structure and RPG abilities manipulate the board. The RPG layer must change placement decisions rather than become a separate HP / ATK combat layer.

The long-term product is built around three complementary modes:

- **Main Story** — teaches Gomoku patterns, introduces heroes/skills, unlocks progression systems, and provides the canonical difficulty ladder.
- **Free Battle** — replayable PvE/PvP sandbox using content earned through the Main Story.
- **Roguelike** — high-variance buildcraft mode unlocked after the player proves mastery of the core systems.

Visual direction remains abstract heroes, premium/minimal pixel treatment, restrained HUD, mobile portrait first.

---

# Core product pillars

1. **Learn through play** — the campaign gradually teaches Gomoku structures, tactical threats, Mana economy, and hero-specific skill usage.
2. **Horizontal growth** — unlock heroes, hero branches, and skills rather than stacking permanent ATK/DEF power.
3. **Readable difficulty** — player-facing strength is expressed as named difficulty tiers, not opaque numerical levels.
4. **Meaningful mastery** — higher difficulty introduces qualitatively smarter CPU behavior, larger boards, stronger skill usage, and encounter rules rather than only larger search budgets.
5. **Positive feedback** — each match can recognize how the player won (patterns, defense, skill usage, Mana efficiency, etc.), not only whether they won.
6. **Reusable content** — campaign encounters become selectable Free Battle opponents once defeated.

---

# Current implemented foundation

## M1 — Combat Foundation ✅
- 9×9 board
- five-in-a-row victory
- pattern-driven Mana
- one primary action per turn unless a skill explicitly grants a free action
- data-driven skill boundary
- targeting / invalid action / Mana / win feedback

## M2 — Heroes & Builds ✅
Current base heroes:

- **VANGUARD** — stable structure advancement and displacement
- **ARCANIST** — board manipulation / tempo
- **SHADE** — corruption / positional disruption
- additional base heroes — TBD

Current skills:

- Shared — **Blink**
- VANGUARD — **Charge**
- ARCANIST — **Flame / Phase**
- SHADE — **Corrupt**
- additional hero skills — TBD

Initial release intent:

- the player starts with **VANGUARD only**
- other base heroes must first be encountered/defeated in Main Story, then unlocked with progression currency

Advanced / derived hero classes are planned but not yet designed. They must be horizontal play-style branches, not simple stat upgrades.

## M3 — CPU & PvE Foundation ✅
- deterministic heuristic CPU
- tactical guardrails for immediate win/block
- pattern recognition
- candidate search
- hero-aware active skill decisions
- CPU Decision Telemetry v2

## M4 — Match lifecycle / product UX ✅
- CPU setup
- hidden random CPU hero reveal
- battle preview
- HUD
- replay/history
- match export / telemetry
- responsive/mobile-first shell

---

# Difficulty model

Player-facing difficulty is defined by six named tiers:

1. **Easy**
2. **Normal**
3. **Hard**
4. **Extreme**
5. **Manic**
6. **Chaos**

These names are canonical across Main Story, Free Battle, Roguelike route composition, telemetry, and encounter content.

A hidden/internal numeric CPU rating or `CpuDifficultyProfile` may still exist for calibration and implementation, but it is **not** the primary player-facing progression language.

## Difficulty capability contract

| Difficulty | CPU identity | Core capabilities | Player learning / mastery target |
| --- | --- | --- | --- |
| **Easy** | Learn | basic placement, immediate win/block, simple center preference, intentionally limited pattern understanding | basic rules, open two / open three awareness, Blink familiarity |
| **Normal** | Understand | structured pattern recognition, basic fork awareness, attack/defense heuristics, simple skill usage | recognize common threats, begin using Mana intentionally |
| **Hard** | Plan | double-threat/fork planning, stronger candidate search, attack-vs-defense priority, tactical skill-vs-placement comparison | plan multiple threats, combine basic hero skills with Gomoku tactics |
| **Extreme** | Predict | selective lookahead, skill-aware board evaluation, Mana/resource awareness, forced-sequence handling | advanced board reading, resource timing, transition to standard 15×15 board |
| **Manic** | Counter | multi-turn placement/skill combinations, stronger pruning/search, hero-specific policy, resource timing | build and break plans, exploit hero identity, react to stronger counterplay |
| **Chaos** | Master | deep selective search, strategic evaluation, strong skill/combo planning, limited player-model adaptation, near-deterministic critical play | endgame mastery, specialized builds, boss-grade strategic play |

### Difficulty rules

- Immediate wins and forced blocks are tactical guardrails; weak difficulties should feel inexperienced, not broken.
- Difficulty increases should come from **new reasoning capabilities first**, parameter tuning second.
- Search depth grows slowly; candidate generation, pruning, tactical extensions, skill evaluation, and strategic evaluation carry most late-game strength.
- Critical tactical situations must not be lost merely because of artificial randomization.
- Bosses may preview the next difficulty tier, but should not rely on hidden cheating information.

---

# Main Story

## Structure

The Main Story is split into **six chapters**, one per difficulty:

1. Easy Chapter
2. Normal Chapter
3. Hard Chapter
4. Extreme Chapter
5. Manic Chapter
6. Chaos Chapter

Each chapter contains regular encounters, hero encounters, teaching/skill-check encounters, and a Boss.

### Boss transition rule

The Boss of each chapter uses the **next difficulty tier's base CPU capability** plus a Boss/hero modifier.

Example:

```text
Easy chapter regular encounters → Easy AI
Easy chapter Boss               → Normal AI + Boss policy
Normal chapter regular encounters → Normal AI
```

This makes each Boss a preview/qualification test for the next chapter rather than an isolated stat spike.

The Chaos Boss is the terminal Main Story challenge and uses Chaos-grade intelligence plus explicit Boss policy/encounter rules.

## Progressive teaching goals

### Easy
Teach:
- legal placement / victory condition
- open two / open three
- basic blocking
- starter VANGUARD identity
- Blink / Charge fundamentals

### Normal
Teach:
- open/closed three and four patterns
- multi-direction threats
- Mana as intentional resource
- first additional hero encounters

Unlock:
- **Soul** economy

### Hard
Teach:
- forks / double threats
- attack vs defense priority
- skill/placement opportunity cost
- hero matchup awareness

Unlock:
- **Skill Fragments**

### Extreme
Teach:
- selective lookahead / forced sequences
- deeper resource timing
- advanced hero/skill combinations

Rules milestone:
- introduce **15×15 standard board**
- the transition may be previewed in the final Hard encounter/Boss before becoming the Extreme default

Unlock condition:
- defeating the Extreme Boss unlocks **Roguelike mode**

### Manic
Focus:
- multi-turn combinations
- hero-specific counterplay
- advanced skill timing
- encounter-specific board rules

### Chaos
Focus:
- mastery
- highly consistent tactical play
- strategic resource/tempo evaluation
- boss-grade hero policies
- specialized build challenges

---

# Progression economy

Progression should remain primarily **horizontal**.

## Soul

Introduced from **Normal** onward.

Primary uses:
- unlock defeated base heroes
- unlock advanced/derived hero branches
- future non-power cosmetic/progression unlocks if needed

Rule:
- defeating a hero makes that hero **eligible to unlock**
- the player then spends Soul to permanently unlock that hero
- defeating a hero does not automatically grant ownership

Avoid using Soul for permanent numerical ATK/DEF/Mana power creep.

## Skill Fragments

Introduced from **Hard** onward.

Primary uses:
- unlock additional active skills
- unlock alternate hero skill options
- unlock build variety

Avoid linear skill ranks such as `Charge Lv.2 = +10% power`. New skills/variants should create different tactical decisions.

## Advanced / derived heroes

Planned after the base roster is validated.

Design rule:
- derived heroes branch into new strategic identities
- they must not simply be stronger versions of the base hero

Example conceptual shape only:

```text
Vanguard
├─ defensive branch
└─ aggressive/tempo branch
```

Exact classes and skills remain TBD.

---

# Free Battle

Free Battle is the repeatable sandbox and practice layer.

## Vs CPU

An opponent configuration becomes available after the corresponding Main Story encounter is defeated.

Unlockable encounter identity includes:
- CPU hero
- difficulty
- skill/loadout configuration
- optional encounter personality/modifier

Example:

```text
Defeat Hard SHADE (Blink + Corrupt)
→ unlock that SHADE / Hard / loadout configuration in Free Battle
```

The goal is to let the player revisit, practice, and master canonical campaign opponents without exposing all high-level configurations at game start.

## Vs Player — Local

Planned:
- pass-and-play
- hero selection
- loadout selection
- rematch
- configurable board/rules where appropriate

PvP should not use CPU difficulty or campaign AI progression.

## Vs Player — Online

Deferred until local PvP and the core content/progression model are validated.

Future requirements:
- authoritative match state
- room / matchmaking
- reconnect
- turn and skill validation
- standardized competitive rule sets

Permanent progression must not create unavoidable PvP stat advantages.

---

# Roguelike mode

## Unlock

Roguelike unlocks after clearing the **Extreme Main Story Boss**.

The player selects one owned hero at run start.

## Three-route difficulty structure

- **Route / Stage 1:** Hard + Extreme opponents
- **Route / Stage 2:** Extreme + Manic opponents
- **Route / Stage 3:** Manic + Chaos opponents

This reuses the same difficulty vocabulary and AI capability contract as Main Story.

## Encounter types

Current planned event categories:
- **Battle** — hero/CPU encounters
- **Skill Choice** — temporary run build decisions
- **Board Field Effect** — encounter-specific board rules

Future optional categories:
- recovery / reroll / tradeoff events
- elite fights
- route choice / risk-reward branches

## Run progression vs Meta progression

These must be intentionally separated.

### Run-only power

Temporary and removed when the run ends:
- temporary skills
- skill modifiers
- passive modifiers
- board relics
- Mana-rule modifiers
- route-specific effects

### Meta rewards

Persist between runs but should remain mostly horizontal:
- Soul
- Skill Fragments
- hero/skill unlock eligibility
- cosmetics
- achievements
- future special branch tokens if justified

Avoid a loop where repeated Roguelike runs permanently increase raw combat stats until strategy becomes secondary.

## Board field effects

Field effects should change board reading rather than simply add damage numbers.

Potential design space:
- temporarily blocked intersections
- Mana-generating zones
- corrupted/unstable intersections
- shifting zones over time
- skill-cost modifiers
- pattern-specific bonuses/penalties

Exact effects remain TBD and require playtesting.

## Roguelike reward loop — open design item

The exact reward cadence, run scoring, elite structure, and long-term reward balance are not finalized.

This must be solved before production implementation of the full Roguelike loop.

---

# Match performance rating

Every completed match should eventually provide readable positive feedback beyond Win/Loss.

Potential evaluation dimensions:
- pattern creation quality
- critical defense
- skill usage quality
- Mana efficiency
- multi-threat creation
- combo execution
- unnecessary resource waste

Example feedback tags:
- 活三高手
- 技能好手
- 鐵壁
- Mana 管理高手
- 連鎖布局

Architecture direction:

```text
Match Telemetry
→ Performance Evaluator
→ score dimensions
→ readable tags / rank
```

The system should be derived from measurable telemetry rather than hard-coded flavor text alone.

Performance rating is **per-match feedback**, not the same system as long-term achievements.

---

# Achievement system

Status: **not yet designed**.

Achievement goals:
- reward mastery/challenge play
- create optional long-term goals
- encourage hero/build experimentation

Potential categories:
- progression achievements
- hero mastery
- difficulty clears
- skill-specific challenges
- unusual victory conditions
- Roguelike accomplishments

Examples are illustrative only:
- defeat the Chaos Boss
- clear a Boss with a specific hero
- win Extreme under a restricted skill condition
- complete hero-specific mastery objectives

Do not tie mandatory combat power to achievements unless later testing proves a need.

---

# CPU architecture direction

The previous Lv.1–100 public progression concept is superseded by the six named difficulty tiers.

However, the existing CPU implementation work remains useful as an **internal profile engine**.

Runtime CPU strength should be composed from:

```text
Difficulty Tier
+ Hero Policy
+ Loadout Policy
+ Encounter Personality
+ Elite Modifier
+ Boss Modifier
+ Board / Route Rules
= Runtime CPU Profile
```

`CpuDifficultyProfile` may continue to hold internal parameters such as:
- pattern depth
- candidate width
- selective search depth
- threat/defense awareness
- skill planning depth
- tactical accuracy
- evaluation quality
- combo planning
- opponent modeling
- decision variance/noise

These are tuning/calibration implementation details, not content progression labels.

CPU Decision Telemetry v2 remains the basis for measuring whether each named difficulty is actually stronger and behaves according to its contract.

---

# Implementation roadmap

The milestones below are intentionally incremental so each system can be validated before the next one depends on it.

## M7 — Difficulty Tier & CPU Intelligence

### M7.1 Pattern Recognition + Candidate Search ✅
Existing pattern/candidate foundation.

### M7.2 CPU Decision Telemetry v2 ✅
Selected/best score, regret, decision reason, top candidates, score decomposition, CPU context.

### M7.3-R Difficulty Tier Foundation
Replace player-facing numeric CPU Level with:

```ts
Easy | Normal | Hard | Extreme | Manic | Chaos
```

Deliverables:
- canonical difficulty type/registry
- mapping from each difficulty to internal CPU profile
- UI selector migration
- match record / replay / export / telemetry migration
- backward compatibility for existing numeric-level records where practical
- difficulty capability matrix tests
- remove public Lv.1–100 language from product UX

Exit criterion:
- all product surfaces speak the same six-difficulty language
- internal tuning remains possible without exposing numeric ratings

### M7.4 Easy / Normal Calibration
Make the first two tiers behaviorally distinct and suitable for teaching.

Measure:
- immediate tactical errors
- pattern recognition rate
- average regret
- intentional variance
- player win rate / match length

### M7.5 Hard Intelligence
Implement/validate:
- double-threat/fork planning
- attack-vs-defense priority
- stronger candidate ordering
- tactical skill-vs-placement comparison

### M7.6 Extreme Intelligence
Implement/validate:
- selective lookahead
- skill-aware board evaluation
- Mana/resource awareness
- forced-sequence handling
- 15×15 performance budget

### M7.7 Manic Intelligence
Implement/validate:
- multi-turn placement/skill combos
- hero-specific decision policy
- stronger pruning / tactical extensions
- resource timing

### M7.8 Chaos Intelligence
Implement/validate:
- strategic evaluation
- deep selective search within strict time budget
- combo planning
- limited match-local opponent modeling
- near-deterministic critical decisions

### M7.9 Boss Policy Layer
Boss behavior becomes an encounter layer above difficulty:
- next-tier preview rule for campaign Bosses
- hero-specific Boss policies
- possible phases/rule modifiers
- no hidden-information cheating

---

## M8 — Main Story Foundation

### M8.1 Campaign data model
- chapter
- encounter
- difficulty
- CPU hero/loadout
- unlock rewards
- Boss marker/modifier
- board rules

### M8.2 Easy Chapter vertical slice
Validate:
- VANGUARD-only start
- teaching progression
- first Boss → Normal preview
- campaign → Free Battle unlock flow

### M8.3 Normal Chapter + Soul
- Soul economy
- hero encounter → eligibility → Soul unlock
- first meaningful roster expansion

### M8.4 Hard Chapter + Skill Fragments
- Skill Fragment economy
- skill unlock/build expansion
- harder tactical teaching

### M8.5 Extreme Chapter + 15×15 + Roguelike unlock
- standard 15×15 rules
- mobile board UX
- Extreme Boss unlocks Roguelike

### M8.6 Manic Chapter
Advanced hero/build counterplay.

### M8.7 Chaos Chapter
Final regular campaign difficulty and terminal Boss content.

---

## M9 — Hero Progression & Build System

### M9.1 Base hero unlock ownership
Campaign encounter + Soul purchase flow.

### M9.2 Skill collection/loadout
Skill Fragment unlocks and configurable loadouts.

### M9.3 Advanced hero branches
Design only after base heroes produce meaningfully different play styles.

---

## M10 — Free Battle

### M10.1 CPU encounter collection
Campaign victories unlock exact reusable opponent configurations.

### M10.2 Local PvP
Pass-and-play and standardized loadout/rule selection.

### M10.3 Online PvP
Deferred product/service milestone after local validation.

---

## M11 — Roguelike

### M11.1 Run skeleton
- hero select
- three-stage route
- battle/event progression
- run end

### M11.2 Temporary build choices
Skills / modifiers / relic-like effects.

### M11.3 Board field effects
Board-rule mutation event framework.

### M11.4 Rewards / Meta loop
Finalize Soul / Skill Fragment / cosmetic / achievement reward balance.

### M11.5 Elite + Boss encounters
Difficulty composition and encounter modifiers.

---

## M12 — Performance Rating & Achievements

### M12.1 Match evaluator
Convert existing telemetry into measurable performance dimensions.

### M12.2 Feedback tags / rank
Readable positive post-match feedback.

### M12.3 Achievement foundation
Persistent challenge tracking after achievement design is finalized.

---

## M13 — Polish & Release

- placement impact
- Mana / skill feedback
- threat warnings
- win presentation
- hero reactions
- haptics
- sound / BGM
- transitions
- onboarding
- accessibility / reduced motion
- analytics/balance telemetry
- beta/staging/release pipeline

---

# Product gates

| Gate | Question |
| --- | --- |
| Combat | Is RPG Gomoku more interesting than normal Gomoku? |
| Difficulty | Does Easy → Chaos feel qualitatively smarter rather than merely slower? |
| Teaching | Does Main Story teach patterns and skills without external explanation? |
| Progression | Do Soul / Skill Fragments create motivation without invalidating board skill? |
| Hero depth | Do heroes/loadouts produce genuinely different board decisions? |
| Extreme | Does 15×15 remain readable and performant on mobile? |
| Roguelike | Do temporary builds/field effects create replayability without permanent power creep? |
| Boss | Does each Boss feel like a meaningful next-tier skill check? |
| Rating | Does post-match feedback help players understand what they did well? |
| Release | Is the validated game strong enough to operate as an ongoing product? |

---

# Open design items

- additional base heroes
- advanced/derived hero classes
- expanded skill roster
- exact Main Story encounter counts per chapter
- Soul acquisition/burn rates
- Skill Fragment acquisition/burn rates
- exact 15×15 introduction encounter
- Roguelike reward cadence
- Roguelike board field-effect catalog
- achievement catalog
- local/online PvP progression rules
- Chaos final Boss identity and encounter rules

---

# Deferred until validated

- large hero roster
- ranked seasons
- account system
- equipment ATK/DEF stat progression
- mandatory power tied to achievements
- monetization that changes competitive board power

The roadmap advances through playtest and telemetry evidence, not feature count.
