# Paper Trails — MVP Planning

> Status: planning only. This directory does **not** register a deployable game yet.

## Product pitch

**Paper Trails / 書頁迷城** is a mobile-first pixel puzzle RPG where the player changes the world by manipulating pages of a living book. The player does not primarily steer the hero; they rotate and swap page tiles so roads, doors, bridges, and special rules connect into a traversable route.

The first MVP is deliberately smaller than the long-term roguelike concept. Its only product question is:

> Is rearranging pages to create and deliberately break routes interesting enough that players want to solve another board?

## MVP pillars

1. **World-as-puzzle-piece** — page manipulation, not combat, is the main verb.
2. **Readable spatial logic** — roads and exits must be understandable at a glance on a phone.
3. **Low-operation mobile interaction** — tap, drag, rotate; no virtual joystick.
4. **Premium restrained visual language** — low-saturation dark book aesthetic, limited antique-gold accents.
5. **32 px pixel production grid** — world art is authored on a 32 px logical tile grid with integer scaling and nearest-neighbor rendering.

## Planning documents

- [`MVP-SPEC.md`](./MVP-SPEC.md) — product scope, six page types, controls, rules, architecture, validation.
- [`ART-DIRECTION.md`](./ART-DIRECTION.md) — 32 px pixel-art production spec for pages, character, UI, palette, animation, export.
- [`ROADMAP.md`](./ROADMAP.md) — implementation slices, gates, CI/Pages integration, definition of done.

## Proposed stack

- **Renderer:** PixiJS
- **Language:** TypeScript, strict mode
- **Build:** Vite
- **Tests:** Vitest for world graph / page manipulation rules
- **Persistence:** localStorage only where useful for chapter progress/settings
- **Target:** portrait mobile web / PWA-friendly shell, desktop as a centered portrait viewport

## MVP boundary

Included:

- 3×3 page board
- 6 page archetypes
- rotate + swap manipulation
- deterministic route graph / reachability
- one player character
- one exit goal
- treasure optional objective
- 10 handcrafted puzzle levels
- concise tutorialization through level design

Explicitly excluded from first validation:

- combat
- stats / equipment
- procedural roguelike runs
- inventory economy
- dialogue system
- backend / accounts
- monetization
- large overworld

## Implementation policy

When implementation begins, create the actual `paper-trails/` project as a complete repository citizen: package/lockfile, tests, Vite subpath config, per-game workflow, reusable Pages registration, bootstrap registration, landing-page link, and mobile/desktop smoke tests. The planning directory intentionally avoids creating a half-integrated game folder before that slice starts.
