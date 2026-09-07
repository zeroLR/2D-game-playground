# Paper Trails / 書頁迷城

Mobile-first antique-book spatial puzzle built with PixiJS, TypeScript, and Vite.

## Current milestone

**P2 — Mobile Page Manipulation**

The P1 world model is now wired into an interactive portrait board. Tap a Page to select it, rotate the selected Page by 90°, drag one Page onto another to swap positions, and reset the authored board. Every manipulation rebuilds the same reciprocal-exit graph used by unit tests, so reachability feedback is derived from domain state rather than renderer-only assumptions.

The center cross Page is deliberately fixed in this smoke board so illegal rotate/swap feedback can be exercised before final content and art are introduced.

Final 32 px pixel art, traveler traversal, objectives, and the 10-level MVP remain later roadmap slices.

## Scripts

```bash
npm ci
npm test
npm run build
npm run dev
```

Production base path: `/2D-game-playground/paper-trails/`.

Product/MVP planning lives in `../docs/plans/paper-trails/`.
