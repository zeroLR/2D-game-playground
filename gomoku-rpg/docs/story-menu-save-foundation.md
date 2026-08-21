# Story Menu + Save Foundation

## Why the menu changes

The previous flow treated every session as an isolated battle:

`Home → Battle Mode → Hero → CPU Setup → Match`

That no longer matches the product roadmap. Main Story, Free Battle and Roguelike have different progression semantics, so the top-level play navigation becomes:

```text
Home
└─ Play
   ├─ Main Story
   │  └─ Easy Chapter → E1-1 … E1-BOSS
   ├─ Free Battle
   │  ├─ Vs CPU
   │  ├─ Local Player
   │  └─ Online Player (future)
   └─ Roguelike (locked until Extreme Boss)
```

The existing CPU/Local/Online selector is retained, but moved under Free Battle.

## Easy Story runtime boundary

This slice turns the Easy Teaching Contract into navigable campaign content:

| Encounter | Teaching focus | CPU |
| --- | --- | --- |
| E1-1 | legal placement + five in a row | Easy |
| E1-2 | open two/open three/basic block | Easy |
| E1-3 | pattern → Mana + Vanguard rhythm | Easy |
| E1-4 | Blink | Easy |
| E1-5 | Charge | Easy |
| E1-BOSS | combined qualification test | Normal preview |

Encounters unlock sequentially. A victory permanently marks the encounter complete and unlocks the next encounter. A defeat does not advance story progress.

This is the campaign shell, not the final tutorial scripting layer. Later Easy Story slices can add seeded boards, contextual prompts and explicit teaching objectives without changing the save schema or navigation model.

## IndexedDB save contract

Database: `gomoku-rpg`

Object store: `save-slots`

Initial slot: `autosave`

`GameSaveV1` currently owns durable progression state:

- completed story encounter IDs
- last completed encounter
- Easy Boss clear flag
- unlocked heroes (Vanguard at new game)
- Soul
- Skill Fragments
- Roguelike unlock flag

The app loads the autosave before the first render and writes after durable progression changes. Match history/settings remain on their existing storage paths for now; migrating those to IndexedDB is a separate data-migration concern and should not be coupled to the first story save implementation.

## Save principles

- save schema is versioned from day one
- normalization protects against malformed/older save payloads
- campaign progress is device-local for the Web MVP
- no account/cloud dependency is required
- autosave is the default UX; explicit multi-slot/manual save can be added later if the product needs it
- browser environments without IndexedDB must not prevent the game from booting

## Next story implementation

1. Add lesson presentation before/inside encounters.
2. Add encounter-specific starting board/state rules where teaching needs them.
3. Add objective telemetry (e.g. actually use Blink in E1-4).
4. Make Story victory screen show teaching feedback and `Next Encounter`.
5. Gate completion on learning objectives only where that improves learning rather than frustrating the player.
