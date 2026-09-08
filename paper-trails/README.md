# Paper Trails / 書頁迷城

Mobile-first antique-book spatial puzzle built with PixiJS, TypeScript, and Vite.

## Current milestone

**P4.1.1 — Objective Semantics Gate**

P1–P4.1 graph manipulation, contextual `GO →`, route pulses, traveler legibility, local progress, and the six-family 32 px Pixel Art contract remain intact. P4.1.1 only addresses the final physical-phone comprehension issue: the player could move correctly but did not understand what the relic and exit symbols meant, and could accidentally complete the chapter by merely crossing the exit.

Objective semantics are now explicit and consistent:

- `◆ RELIC` is used both on the objective strip and on the Relic Page.
- `▣ SEALED` / `▣ EXIT` is used both on the objective strip and on the Exit Page.
- recovering the relic changes the exit state and pulses the Exit Page twice.
- objective effects resolve only for the Page explicitly selected as the `GO →` destination; intermediate Pages never collect the relic or complete the chapter.

The intended loop is therefore:

1. reshape the book to connect roads,
2. explicitly select `◆ RELIC` and use `GO →`,
3. observe `▣ EXIT` open and receive the exit pulse,
4. explicitly select `▣ EXIT` and use `GO →` to complete the chapter.

The visual treatment extends the existing restrained antique-book system: ink, moss, stone, parchment, antique gold, and muted seal red. No new HUD pattern or accent-color family is introduced.

## Scripts

```bash
npm ci
npm test
npm run build
npm run dev
```

Production base path: `/2D-game-playground/paper-trails/`.

Product/MVP planning lives in `../docs/plans/paper-trails/`.
