# Paper Trails / 書頁迷城

Mobile-first antique-book spatial puzzle built with PixiJS, TypeScript, and Vite.

## Current milestone

**P4.1 — Mechanic Legibility Gate**

The P1–P4 graph, touch manipulation, traversal, objectives, local progress, and six-family 32 px Pixel Art contract are preserved. P4.1 focuses only on making the core cause-and-effect loop readable on a phone before authoring the 10-level MVP.

The interaction model is now explicit:

1. rotate or swap a Page to open a road,
2. newly reachable routes receive a short antique-gold connection pulse,
3. tap a reachable Page to select it,
4. use the contextual `GO →` control to travel.

The previous hidden `tap the destination twice to walk` convention has been removed.

P4.1 also adds:

- a compact objective strip in the header (`FIND THE RELIC` → `RETURN TO THE GATE`),
- first-run visual focus cues for Rotate and contextual GO,
- stronger traveler separation via a restrained antique-gold ground halo and dark silhouette backing,
- the authored arrival frames on traversal completion,
- reduced debug presentation: Page names appear only for the selected Page and reachability/rotation debug numbers are no longer part of the main HUD.

The existing smoke chapter remains the gate: reshape the book, traverse to the Hidden Grove relic, then return to the Ruined Gate to complete the chapter. The next slice should only proceed to the 10-level authored set once an unbriefed mobile player can understand `reshape → connect → travel → objective` from the interface itself.

## Scripts

```bash
npm ci
npm test
npm run build
npm run dev
```

Production base path: `/2D-game-playground/paper-trails/`.

Product/MVP planning lives in `../docs/plans/paper-trails/`.
