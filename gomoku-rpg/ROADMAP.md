# Gomoku RPG — Product Roadmap

## Product direction

A portrait-first, 3–5 minute strategy duel where Gomoku supplies the victory structure and RPG abilities manipulate the board. RPG systems must change placement decisions rather than become a separate HP / ATK combat layer.

Visual direction: abstract characters, minimal premium pixel presentation, restrained HUD, mobile portrait first.

## Current state

### M0 — Core Prototype ✅
- 9×9 board
- five in a row wins
- VS CPU
- pattern-driven Mana
- Blink as the first board-manipulation skill

### M0.1 — Playable Loop ✅
- victory / defeat / draw states
- replay without browser reload
- English default locale
- Traditional Chinese (`zh-TW`)
- persisted language preference

---

## M1 — Combat Foundation

**Goal:** prove that the RPG layer creates meaningful decisions beyond ordinary Gomoku.

### M1.1 Pattern & Mana rules
Formalize pattern rewards instead of treating every `3+` line as the same event.

Initial rule set to playtest:
- newly formed 3-line: +1 Mana
- newly formed 4-line: +2 Mana
- multiple new qualifying lines from one placement stack their rewards
- extending an existing rewarded line must not repeatedly farm the same pattern
- skill movement does not generate Mana in M1 unless explicitly stated by the skill
- Mana remains capped at 5 during M1

Acceptance question: can a player intentionally choose between immediate board pressure and building Mana economy?

### M1.2 Turn action model
Every turn performs exactly one primary action:
- Place Stone
- Use Skill

Skills consume tempo. A skill never grants a free normal placement unless explicitly designed to do so later.

### M1.3 Skill framework
Create a data-driven skill boundary with id, Mana cost, target type, legal target calculation, execution, and localized description.

### M1.4 Board feedback
- legal target highlight
- selected source / destination state
- invalid target feedback
- Mana gain feedback
- winning five-line highlight
- CPU thinking feedback

### M1 exit criteria
The player must encounter real situations where using a skill instead of placing a stone is a defensible choice.

---

## M2 — Heroes & Builds

**Goal:** prove that hero choice changes how the board is read and played.

First three abstract hero archetypes:
- **Vanguard** — structure advancement and stability
- **Arcanist** — board manipulation / tempo
- **Shade** — positional disruption and pressure

### M2.4 playtest-driven skill redesign
- Common skill boundary: Blink
- Shade vertical slice: Pressure + Corrupt
- Vanguard vertical slice: Fortified + Charge
- Arcanist vertical slice: pending

**Deferred — Bulwark:** the defensive cluster-Guard design is retained but unequipped. Current CPU has no hostile active skills, so playtesting showed no meaningful reason to spend a turn and 3 Mana on it. Re-evaluate Bulwark after the CPU Skill System exists and can actively disrupt player structures.

Exit criterion: players should describe different strategic priorities for each hero, not merely different visual effects.

---

## M3 — CPU & PvE

**Goal:** make solo play exercise the full RPG rules rather than only basic Gomoku blocking.

Difficulty layers:
- Easy — basic patterns, intentional tactical misses
- Normal — offensive / defensive scoring, skill usage, shallow lookahead
- Hard — Mana economy, skill-aware evaluation, deeper search

CPU implementation direction: deterministic heuristic evaluation with minimax / alpha-beta where useful; no ML dependency required.

Enemy personalities:
- Sentinel — defensive
- Duelist — aggressive
- Trickster — control-heavy
- Oracle — setup / pattern-oriented

Exit criterion: the player must track the opponent's Mana and possible skills as part of threat assessment.

---

## M4 — Meta Progression

**Goal:** add replayability without stat-based power creep.

Prefer horizontal progression:
- unlock skills
- build a skill pool
- equip a limited loadout
- unlock alternative hero play styles

Optional PvE run structure:
Battle → Upgrade → Battle → Upgrade → Elite → Upgrade → Boss

Target run length: 15–25 minutes while individual battles remain 3–5 minutes.

Avoid permanent ATK / DEF style numerical advantages that undermine board-game fairness.

---

## M5 — Local PvP

**Goal:** validate human mind games before paying the complexity cost of online multiplayer.

- pass-and-play on one phone
- hero selection
- loadouts
- rematch
- optional custom rules such as board size / win length

Exit criterion: players should actively predict the opponent's possible skill action, not only their next stone placement.

---

## M6 — Online PvP

**Goal:** service-ize PvP only after local PvP proves the design.

First version:
- create room
- room code
- join room
- ready state
- authoritative match state
- reconnect
- rematch

Server owns validation of turn, Mana, legal actions, skill targets, and victory state.

---

## M7 — Polish & Release

**Goal:** turn the validated systems into a coherent mobile game.

Visual language:
- abstract geometric hero identities
- minimal premium pixel treatment
- restrained accent palette
- motion and particles as identity rather than detailed character illustration

Polish:
- placement impact
- Mana pulse
- skill cast feedback
- threat warning
- winning line presentation
- abstract hero reaction
- haptics
- sound / BGM
- transitions
- onboarding and first-match tutorial
- accessibility / reduced motion considerations

---

## Product gates

| Stage | Milestones | Question |
| --- | --- | --- |
| Prototype | M0–M1 | Is RPG Gomoku actually more interesting than normal Gomoku? |
| Vertical Slice | M2–M3 | Do heroes and opponents create meaningful replayability? |
| Game | M4–M5 | Is there enough depth to support repeated play? |
| Online Product | M6–M7 | Is the proven game worth operating as a service? |

## Deferred until validated

- **Bulwark** — re-evaluate after CPU Skill System can threaten protected structures
- online matchmaking
- ranked seasons
- account system
- equipment stats
- character levels / ATK / DEF progression
- narrative campaign
- large hero roster

The roadmap should advance through playtest evidence, not feature count.
