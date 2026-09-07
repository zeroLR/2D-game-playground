# Paper Trails / 書頁迷城

Mobile-first antique-book spatial puzzle built with PixiJS, TypeScript, and Vite.

## Current milestone

**P3 — Traveler Traversal & Objective Loop**

P1's reciprocal-exit graph and P2's mobile rotate/swap interaction now drive a complete single-level loop. Tap a Page once to select it; tap the same reachable destination again to walk the deterministic shortest path. Input is locked during traversal and the traveler advances Page-by-Page through the domain graph.

The P3 smoke objective requires recovering the relic on `p9` and then returning to the sealed EXIT on `p3`. Passing the EXIT before the relic gives locked feedback rather than completing the level. Completion is persisted to a versioned localStorage save through an injected/testable storage boundary.

The authored start deliberately needs one clockwise rotation of the traveler Page before the route opens, keeping manipulation and traversal in the same validation slice. The center cross Page remains fixed so illegal manipulation feedback is still exercised.

Final 32 px pixel art, authored Page identities, traveler sprite animation, and the broader 10-level MVP remain later roadmap slices.

## Scripts

```bash
npm ci
npm test
npm run build
npm run dev
```

Production base path: `/2D-game-playground/paper-trails/`.

Product/MVP planning lives in `../docs/plans/paper-trails/`.
