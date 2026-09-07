# Paper Trails — MVP Roadmap

> Goal: reach a mobile-playable 10-level vertical slice without adding combat, economy, or roguelike meta before the page-manipulation mechanic is validated.

## Delivery strategy

Keep each slice reviewable and playable. Do not start the next content-heavy slice until the current interaction gate has been tested on an actual phone.

```mermaid
flowchart LR
    P0[P0 Scaffold] --> P1[P1 Page Graph]
    P1 --> P2[P2 Touch Manipulation]
    P2 --> P3[P3 Character Traversal]
    P3 --> P4[P4 Art + 6 Pages]
    P4 --> P5[P5 10-Level MVP]
    P5 --> P6[P6 Pages Deploy + Validation]
```

## P0 — Repository-complete scaffold

**Objective:** create the real `paper-trails/` game as a complete repository citizen, not a half-integrated folder.

### Deliverables

- [ ] `paper-trails/package.json` + committed lockfile
- [ ] Vite + strict TypeScript + PixiJS
- [ ] `paper-trails/index.html`
- [ ] explicit async renderer bootstrap with logs/error UI/timeout handling
- [ ] portrait shell and centered desktop portrait viewport
- [ ] `npm test` and `npm run build`
- [ ] Vite base path for `/2D-game-playground/paper-trails/`
- [ ] `.github/workflows/paper-trails.yml`
- [ ] register `paper-trails` in reusable `game-pages.yml` validation + landing page
- [ ] register build/list/link in every required `pages-bootstrap.yml` location

### Gate

- `npm ci`
- `npm test`
- `npm run build`
- generated `dist/index.html` references subpath-safe assets
- blank-page failure produces visible bootstrap error instead of empty `#app`

## P1 — World model and connectivity

**Objective:** validate the puzzle as pure domain logic before art or gestures.

### Deliverables

- [ ] `PageDefinition` data model
- [ ] `PageState` position/rotation/state
- [ ] cardinal exits N/E/S/W
- [ ] rotation transform
- [ ] page swap command
- [ ] adjacency graph rebuild
- [ ] BFS/DFS reachability
- [ ] shortest path for traveler
- [ ] deterministic level reset
- [ ] unit tests for all above

### Temporary visualization

Use simple monochrome rectangles/lines only. No final pixel art required.

### Gate

Given the same authored board and command sequence, world state and reachable set are deterministic and test-covered.

## P2 — Mobile page manipulation

**Objective:** make rotate/swap understandable and reliable with one thumb.

### Deliverables

- [ ] 3×3 page board
- [ ] tap select
- [ ] rotate selected page 90°
- [ ] drag page → page swap
- [ ] legal/illegal manipulation feedback
- [ ] reachable-page visualization
- [ ] reset control
- [ ] responsive portrait layout
- [ ] touch target audit (>= 44 CSS px)

### Playtest gate

On phone, a new player can solve a 3-page rotate tutorial and a swap tutorial without being told the internal graph rule.

If this fails, do not proceed to content production; fix interaction/readability first.

## P3 — Traveler traversal and objective loop

**Objective:** close the puzzle loop: manipulate world → move traveler → reach goal.

### Deliverables

- [ ] traveler entity/domain position
- [ ] tap reachable destination
- [ ] page-graph pathfinding
- [ ] automatic page-to-page movement
- [ ] block board manipulation while movement is resolving
- [ ] goal page/goal anchor
- [ ] treasure optional objective
- [ ] level completion state
- [ ] local chapter progress save

### Gate

Player can intentionally create a route, tap destination, watch the traveler traverse it, then reconfigure the board for a treasure before exiting.

## P4 — 32 px pixel-art vertical slice

**Objective:** prove the final art density and low-saturation visual hierarchy in-engine before producing all levels.

### Deliverables

- [ ] global palette + edge template
- [ ] nearest-neighbor texture settings
- [ ] integer-scale camera rules
- [ ] traveler `32×48` sprite set
- [ ] six `96×96` Page archetypes:
  - [ ] Forest Path
  - [ ] Ruined Gate
  - [ ] Stone Bridge
  - [ ] Crossroads
  - [ ] Shrine / Seal
  - [ ] Hidden Grove / Treasure
- [ ] page selection / goal / connection gold-accent states
- [ ] book frame / restrained HUD

### Gate

At actual phone size:

- routes can be read without zooming
- exits line up perfectly across neighboring pages
- traveler silhouette remains readable on both light and dark terrain
- no filtering blur/shimmer during normal camera movement

## P5 — 10-level MVP content

**Objective:** validate progression of understanding, not content volume.

### Level sequence

- [ ] L1 Rotate
- [ ] L2 Exit matching / multi-rotate
- [ ] L3 Swap
- [ ] L4 Rotate + swap
- [ ] L5 Optional treasure / break working route
- [ ] L6 Crossroads / multiple valid routes
- [ ] L7 Shrine/seal rule
- [ ] L8 Deliberate route destruction
- [ ] L9 Treasure + goal multi-step
- [ ] L10 Full 3×3 mastery board using all six archetypes

### UX polish

- [ ] concise in-world tutorial cues only where necessary
- [ ] completion transition
- [ ] optional best move count after completion
- [ ] restart level
- [ ] settings: sound/reduced motion if motion is substantial

### Gate

Primary validation question:

> After a valid direct route exists, will the player deliberately alter it to obtain an optional objective or test a better route?

Do not add meta progression if this behavior does not appear.

## P6 — Deploy and smoke validation

**Objective:** deliver the MVP as a stable Pages game.

### CI

- [ ] PR build/test does not publish unintentionally
- [ ] `main` deployment updates complete-site Pages state
- [ ] bootstrap full rebuild contains Paper Trails and all existing games
- [ ] no existing game is removed from complete-site validation lists

### Browser smoke tests

Desktop + mobile:

```js
document.querySelector('#app') !== null
document.querySelector('canvas') !== null
document.querySelector('#app')?.dataset.bootstrapError === undefined
```

Also verify:

- [ ] first interactive board visible
- [ ] pointer/touch drag works
- [ ] assets return 200 from Pages subpath
- [ ] rotate/swap work after page reload
- [ ] local progress survives reload

## Post-MVP — only after mechanic validation

Prioritize mechanic-deepening before content inflation.

### P1 expansion candidates

- page locks / fixed pages
- one-way exits
- foldable/double-sided pages
- night-only routes
- movable platforms / bridges
- chapter themes: forest, desert, snow, sky ruins

### Roguelike layer

Only after the handcrafted puzzle loop works:

- randomized page rewards
- run-based page collection
- branching chapter map
- authored random events
- character archetypes that change page rules rather than add combat stats

### RPG layer

Prefer abilities coupled to the core mechanic:

- Cartographer: preview one hidden page
- Scholar: rotate one normally locked page
- Thief: carry one page between chapters
- Binder: pin one page so swaps cannot move it

Avoid turning the project into a conventional combat RPG whose page mechanic becomes secondary.

## Definition of MVP done

Paper Trails MVP is done when:

1. the mechanic is playable on mobile from tutorial through L10;
2. all six page archetypes and the traveler use the approved 32 px pixel pipeline;
3. world manipulation and graph logic are deterministic and unit-tested;
4. production build and repository CI pass;
5. GitHub Pages deployment is complete-site safe;
6. desktop/mobile smoke tests confirm renderer boot, canvas mount, touch interaction, and valid subpath assets;
7. playtest evidence supports or rejects the core reconfiguration hypothesis before scope expands.
