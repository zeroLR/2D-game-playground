# Paper Trails / 書頁迷城

Mobile-first antique-book spatial puzzle built with PixiJS, TypeScript, and Vite.

## Current milestone

**P4 — 32 px Pixel Art & Page Identity**

The P1–P3 graph, touch manipulation, traversal, objective, and local-progress semantics are preserved, but the smoke-board presentation has been replaced by authored low-saturation Pixel Art.

P4 ships six Page families:

- Forest Path
- Ruined Gate
- Stone Bridge
- Crossroads
- Shrine Seal
- Hidden Grove

Each Page image is authored as a 96×96 RGBA PNG on a 3×3 logical grid of 32 px tiles. Page art rotates with the Page state, while graph connectivity continues to come exclusively from the domain model.

The traveler now uses a 32×48 frame size and a 17-frame RGBA sprite sheet covering idle, walk south/east/north, mirrored west walking, and arrival frames. Runtime rendering keeps the palette intentionally restrained: ink, moss, stone, parchment, antique gold, and a small muted-red accent for seals/invalid state.

The existing P3 smoke chapter still validates the full loop: reshape the book, traverse to the Hidden Grove relic, then return to the Ruined Gate to complete the chapter.

## Scripts

```bash
npm ci
npm test
npm run build
npm run dev
```

Production base path: `/2D-game-playground/paper-trails/`.

Product/MVP planning lives in `../docs/plans/paper-trails/`.
