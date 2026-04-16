---
name: game-deckbuilder
description: |
  Use this skill when the chosen game type is a single-player deckbuilder (Slay the Spire-like). Covers genre pillars (deck as character, draw/play/discard rhythm, synergy discovery, run-based variance), the required systems checklist (card data, zones, targeting, intent telegraph, energy curve, relics, encounter generator, map graph), the recommended stack (Vite + TS + PixiJS or Phaser, Howler), the loop pattern (turn-based instant), genre-specific pitfalls (shuffle bias, effect ordering), the spec template, and reference exemplars.

  TRIGGER when: docs/concept.md names "deckbuilder" as the chosen genre, or the user says "deckbuilder", "Slay the Spire-like", "STS-like", "Monster Train-like", "Inscryption-like", "Balatro-like", "card-based roguelike", "single-player card game", "deck-building game".

  DO NOT TRIGGER when: docs/concept.md does not yet exist — use game-concept first; the genre is a multiplayer TCG / CCG with opponent-built decks (out of scope for this skill); the genre is something other than deckbuilder; the question is purely technical with no genre context — use the relevant generic skill.
---

# game-deckbuilder

A single-player deckbuilder is a turn-based game where the player's *deck* is the character: drawing, playing, and modifying cards across a run is the entire game. Combat or challenges are encounters that pressure the deck. The genre boundary matters: this is **not** a TCG/CCG (no opponent-built deck, no booster economy, no PvP), and **not** a board-game adaptation — it's a video-game-native, run-based, single-player loop.

This skill captures what is **specific** to the genre. Generic patterns (event bus, save/load, scene stack) live in the generic skills; this file links to them and tells you which ones you actually need.

## Genre pillars

Remove any of these and it stops being a deckbuilder:

- **Deck as character.** Card additions/removals/upgrades during a run *are* the progression. Stats and levels, if present, are secondary.
- **Draw / play / discard rhythm.** A turn is bounded by hand size and a resource (energy/mana/coins) that resets. Tension comes from picking what *not* to play.
- **Synergy discovery.** Cards combine into emergent strategies. The first run teaches you a few; the tenth reveals an archetype you never saw.
- **Run-based variance.** Each run offers different cards, relics/artifacts, and encounters. Two runs of the same character must feel different.
- **Telegraphed pressure.** Encounters announce their next move (intent icons) so card choices are tactical, not random.

State explicitly in `docs/concept.md` whether your encounters use **intent telegraphing** (STS) or **simultaneous resolution** (Monster Train) — they drive different system designs.

## Required systems checklist

Each item links into the generic skills; do not re-implement.

- [ ] **Card data schema** — JSON or TypeScript module of pure data: `id`, `name`, `cost`, `type`, `rarity`, `effects[]`, `keywords[]`. Effects are interpreted, not coded per-card. Define inline; no generic skill owns this.
- [ ] **Zones** — `draw`, `hand`, `discard`, `exhaust` (and `play` momentarily). Move cards between zones via a single function so save/load is trivial.
- [ ] **Targeting** — every effect declares its target type (`self`, `singleEnemy`, `allEnemies`, `randomEnemy`). Resolve at play time, not authoring time.
- [ ] **Intent telegraph** — each enemy publishes its next action *before* the player's turn ends. Render as an icon + value above the enemy.
- [ ] **Energy / resource curve** — start-of-turn refill, per-card cost, persistent costs (block, poison stacks). Keep one canonical resource; secondary currencies belong to relics.
- [ ] **Relic / artifact hooks** — passive modifiers that listen to events (`onCardPlayed`, `onTurnStart`, `onDamageTaken`). → see **game-systems** § "Event bus" for the bus; relic logic is genre-specific glue on top.
- [ ] **Encounter generator** — pool by act/floor, weighted by rarity, never repeat within window. Seeded by the run RNG. → see **game-scaffold** § "Phase 3 — Seeded RNG first".
- [ ] **Map node graph** — branching path with rooms (combat / elite / event / shop / rest / boss). Generate once at run start; render as nodes + edges.
- [ ] **Save / load with version** — serialize the deck, draw pile order (or seed + index), zones, relics, map state, current room. → see **game-systems** § "Save / load".
- [ ] **Animation queue** — card movements, damage numbers, status pings. Input must wait for queue to drain or be queued. → see **game-loop** § "Animation layer".
- [ ] **Input → action mapping** — clicks, drags, keyboard shortcuts all funnel through one `Action` union. → see **game-systems** § "Input → Action mapping".

## Recommended stack

**Vite + TypeScript + PixiJS + Howler** (or **Vite + TS + Phaser 3** if you want scenes/tweens out of the box).

- **Vite + TypeScript** — same reasons as everywhere else; strict typing catches malformed card effects early.
- **PixiJS** — cards are sprites with rich text, drag-and-drop, layered effects; PixiJS's WebGL renderer handles dozens of animated cards at 60 FPS without trouble.
- **Phaser 3** alternative — if the user wants pre-built scenes, tween manager, and input system, Phaser is a faster path to a polished feel; pay for it with a heavier dependency.
- **Howler** — small, reliable audio library; deckbuilders live and die by sound feedback (card play, hit, status apply).
- **No `rot.js`.** No FOV, no pathfinding, no dungeon gen needed.

`game-scaffold` will pick this up from `docs/concept.md` and skip its own matrix.

## Loop shape

**Shape #3 (turn-based, instant) from `game-loop` § "Decide the loop *shape* first".**

Encounter loop: *enemies show intents → player draws → player plays cards / ends turn → enemies resolve intents → repeat*. No speed scheduler — turn order is fixed (player → enemies). Run the sim in response to input; render via `requestAnimationFrame`. The animation queue from `game-loop` § "Animation layer" sits in front of input.

Outside encounters (map navigation, shop, rest), the game is a UI-only state machine; render at `requestAnimationFrame` for smooth transitions, but no sim ticking.

## Genre-specific pitfalls

- **Shuffle bias.** Naive `arr.sort(() => Math.random() - 0.5)` is **not** uniform — it's badly biased and breaks "draw 5" feel. Use Fisher-Yates with the injected RNG. Test by running 10k shuffles and asserting per-position distribution.
- **Undefined card-effect ordering.** When two cards trigger on the same event (e.g. `onCardPlayed`), the order matters. Define a deterministic precedence (zone, then play order, then card id) and test it. The reproduce-this-bug-from-screenshot moments come from here.
- **Animation queue blocks input.** If a chained combo enqueues 30 animations, the player waits. Either compress duplicates ("hit ×3" instead of three separate animations), allow skip/fast-forward, or batch resolution and play one summary animation.
- **Balance regressions without a sim harness.** Once card count exceeds ~40, hand-balancing breaks. Build a headless `runSim(seed, agentPolicy) → outcome` from day one; gate releases on win-rate stability across N seeds. The genre demands it.
- **Relic combo blow-ups.** A new relic + an existing card can produce infinite loops (free card → triggers relic → free card). Cap effect-recursion at ~50 and log when hit. Treat hits as bugs to fix, not as gameplay.
- **Save corruption mid-encounter.** Save *between* rooms, not mid-turn — it's enough granularity for the genre and avoids serializing in-flight animations.
- **Hidden non-determinism.** Same as roguelikes: `Date.now()` in shuffles, `Set` iteration order driving targeting, async events resolving in unpredictable order. Audit early.
- **Card text vs effect drift.** The card's flavor text and its actual effect must match — players read cards 10x more than designers do. Render the effect from the data, never hand-write the text.

## Spec template (write into `docs/concept.md`)

After Phase 5 of `game-concept`, append a `## Deckbuilder spec` section with:

- **Run shape** — acts × floors per act × boss cadence (e.g., "3 acts × ~16 rooms × 1 boss each").
- **Starting deck** — exact card list per character/class.
- **Resource model** — energy per turn, hand size, draw count, discard policy.
- **Card pool** — count by rarity per character; shared neutral pool, if any.
- **Keyword glossary** — every status / mechanic in one table (Block, Vulnerable, Weak, Poison, Strength, Frail …). Lock it before writing cards.
- **Encounter table** — common pool, elite pool, boss list per act; intent pattern per enemy (deterministic vs weighted).
- **Relic / artifact pool** — count by rarity, acquisition rules (boss reward, elite reward, shop, event).
- **Map structure** — branching factor, room-type frequencies, guaranteed nodes (rest before boss, shop on path, etc.).
- **Run length target** — minutes per act, total run minutes. Drives content budget.
- **Win/loss conditions** — pure death? Acts cleared? Endless mode?
- **Meta-progression scope** — none / unlock cards / unlock characters / persistent stat upgrades. Be honest; this is where deckbuilders overscope.

## Reference exemplars

- **Slay the Spire** — the genre-defining template. Steal: intent telegraphing, three-act pacing, draw-play-end-turn rhythm, relic event hooks. Read the modding API for a free system breakdown.
- **Monster Train** — multi-floor simultaneous combat; demonstrates that "lanes" can replace "single front" without breaking the genre. Steal: how added dimensions interact with the energy curve.
- **Inscryption** — proves the genre can host puzzle-design and meta-narrative; the deck is the story. Steal: scene transitions and progression as content.
- **Balatro** — poker-hand scoring as the play action; same draw/play/discard skeleton with a radically different mechanic. Steal: how scoring multipliers can replace "damage" entirely.
- **Dream Quest** — the proto-STS; rough but instructive on the minimum viable deckbuilder. Read it if scoping a jam.

## Hand-off

- `game-scaffold` — bootstrap Vite + TS + PixiJS (or Phaser) + Howler; folder layout (`cards/`, `encounters/`, `relics/`, `map/`, `ui/`).
- `game-loop` — shape #3 (turn-based instant) + the animation queue from § "Animation layer".
- `game-systems` — event bus (relics), input mapping (drag-and-play), save/load with version.
- `game-perf` — only after profiling shows a measurable problem (animation queue stalls, GC pauses on combo chains, slow encounter generation).
