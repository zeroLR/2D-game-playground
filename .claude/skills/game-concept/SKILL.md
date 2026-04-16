---
name: game-concept
description: |
  Use this skill when starting a new game project before any tech decisions. Extracts game identity (logline, worldview, player verbs, scope) and assigns a Chosen Genre that downstream skills read. Produces docs/concept.md — required before game-scaffold.

  TRIGGER when: user says "I want to make a game", "I have a game idea", "help me design a game concept", "what genre should my game be", "start a new game project", or when game-scaffold encounters a missing docs/concept.md.

  DO NOT TRIGGER when: docs/concept.md already exists with a Chosen Genre and the user is past the concept phase; the user is working on an existing project with a defined genre.
---

# game-concept

Concept and worldview come first. Tech and genre come second. This skill extracts just enough of a game's identity to pick a genre with confidence — no more, no less. Everything downstream (stack, loop shape, systems) falls out of the genre decision, so the concept doc is the contract.

By the end you will have `docs/concept.md` with six sections and a **Chosen Genre** line. A genre skill (`game-roguelike`, `game-deckbuilder`, …) reads that line and takes over.

## Phase 0 — Logline

Force a one-sentence pitch. If the user can't write one, the idea isn't ready.

Template: *"A `[genre-ish adjective]` game where the player `[core verb]` in order to `[goal]`, set in `[setting]`."*

Example: *"A short turn-based game where the player drafts cards to survive nightly sieges in a collapsing lighthouse."*

Write the logline as the top of `docs/concept.md`. Revise it at the end if later phases change it.

## Phase 1 — Worldview

Six quick answers. Keep each to 1–3 sentences. The goal is evocation, not a novel.

1. **Setting** — where and when. Concrete: "1890s Appalachian coal town, after a mine fire" beats "dark fantasy."
2. **Tone** — e.g., dread, whimsical, melancholic, absurd, grim-earnest. One or two words.
3. **Protagonist** — who the player is (or plays as). Role, not name.
4. **Antagonist forces** — what resists the player. Can be a faction, a nature, an economy, an internal state.
5. **Themes** — the 2–3 ideas the game is *about*. Not mechanics — meaning. "Isolation," "debt," "forgiveness."
6. **Sensory palette** — dominant colors, key sounds, signature prop. Short. This informs art direction later.

Then capture **references**: 3 games + 3 non-game (film, book, place, music, painting, myth). References are stronger signal than abstract adjectives.

Worldview directly constrains genre. A tone of "dread + isolation + collapse" plus a protagonist with no combat skills rules out bullet-hell; it points at puzzle, narrative, or survival.

## Phase 2 — Player fantasy & verbs

Ask: **"What does the player actually do, second to second?"** List 3–7 verbs. These are the honest spine of the genre.

- *Draw, play, remove, upgrade, draft* → deckbuilder
- *Move, bump-attack, descend, identify, die* → roguelike
- *Jump, dash, wall-slide, pogo, respawn* → platformer
- *Place, route, upgrade, wait, balance* → simulation / tycoon
- *Aim, dodge, reload, bank, graze* → bullet-hell / shmup
- *Push, slide, undo, solve* → puzzle
- *Select, cover, overwatch, flank, end turn* → tactics / SRPG

If the verbs don't cluster, the concept isn't a game yet — push the user back to Phase 1.

## Phase 3 — Audience & scope

Three one-liners:

1. **Scope** — jam (≤ 1 week), prototype (1–2 months), commercial (6+ months). Drives what can be promised.
2. **Session length** — 5 min, 30 min, 2 hour+. Drives save design and content budget.
3. **Platform** — desktop browser only, mobile touch, both. Drives input and render decisions.

## Phase 4 — Genre selection matrix

Map the verb cluster from Phase 2 to a candidate genre, cross-check against tone from Phase 1. Pilot genre skills currently available in this repo:

| Verb cluster | Candidate genre | Load skill |
|---|---|---|
| Draw / play / draft cards | Deckbuilder | `game-deckbuilder` |
| Move-bump / descend / permadeath | Roguelike | `game-roguelike` |

More genres will be added (platformer, tactics, metroidvania, bullet-hell, puzzle, simulation). If the verb cluster doesn't fit a listed genre, record it anyway as a free-form `Chosen Genre` and proceed to `game-scaffold`, which falls back to its own stack matrix.

If the user is genuinely torn between two genres: pick the one whose **pillars** (read in the genre skill's opening section) line up with the worldview's tone and themes. Mechanics are interchangeable; meaning is not.

## Phase 5 — Write `docs/concept.md`

Create `docs/concept.md` with exactly these sections:

```markdown
# <working title>

## Pitch
<one-sentence logline from Phase 0>

## Worldview
- **Setting:** …
- **Tone:** …
- **Protagonist:** …
- **Antagonist forces:** …
- **Themes:** …
- **Sensory palette:** …
- **References:** 3 games + 3 non-game

## Verbs
- …
- …
- …

## Audience & scope
- **Scope:** jam | prototype | commercial
- **Session length:** …
- **Platform:** …

## Chosen Genre
<genre name — exactly matches a game-<genre> skill name if one exists>

## Why this genre
<2–4 sentences connecting verbs and worldview to the genre pick>
```

The `Chosen Genre` line is a machine contract, not prose. Downstream skills grep for it. Keep it to a single lowercase word matching an existing genre skill (`roguelike`, `deckbuilder`, …) when possible.

## Anti-patterns

- **Jumping to tech first.** "Should I use Phaser or PixiJS?" is meaningless before the verbs are listed. Redirect.
- **Genre before worldview.** "I want to make a roguelike" is fine as a seed, but still answer Phases 1–2 or the game will be generic.
- **Worldview-only pitches.** "Melancholy lighthouse keeper" is a short story, not a game. Phase 2 verbs are non-negotiable.
- **Listing ten references.** Three games + three non-game. More signals indecision.

## Hand-off

- Genre now named → load `game-<genre>` (e.g. `game-roguelike`, `game-deckbuilder`).
- Then `game-scaffold` for tech stack + folder layout (the genre skill will inject its recommended stack).
- Then `game-loop` → `game-systems` → `game-perf` as normal.
