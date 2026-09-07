# Paper Trails / 書頁迷城

Mobile-first antique-book spatial puzzle built with PixiJS, TypeScript, and Vite.

## Current milestone

**P1 — World Model & Connectivity**

P1 implements the puzzle as deterministic pure TypeScript domain logic before touch gestures or final pixel art. The current renderer is intentionally a monochrome graph smoke view driven by the same world state used in tests.

Implemented domain primitives:

- `PageDefinition` and unique `PageState` instances
- cardinal N/E/S/W exits with 90° rotation transforms
- immutable rotate/swap commands
- adjacency graph rebuild from reciprocal exits
- BFS reachability and shortest-path traversal
- deterministic authored-level reset with validation

P2 will add mobile rotate/swap interaction on top of this model; P3 will use the shortest-path result for traveler movement.

## Scripts

```bash
npm ci
npm test
npm run build
npm run dev
```

Production base path: `/2D-game-playground/paper-trails/`.

Product/MVP planning lives in `../docs/plans/paper-trails/`.
