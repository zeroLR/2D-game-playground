# Paper Trails / 書頁迷城

Mobile-first antique-book spatial puzzle built with PixiJS, TypeScript, and Vite.

## Current milestone

**P4.1.1 Revision — World-Embedded Objective**

P1–P4.1 graph manipulation, contextual `GO →`, route pulses, traveler legibility, local progress, and the six-family 32 px Pixel Art contract remain intact. The explicit-destination rule from P4.1.1 is also preserved: only the Page intentionally selected through `GO →` can resolve an objective, so merely crossing the relic or exit never collects or completes anything.

This revision removes the objective-strip copy and Page-corner `RELIC / SEALED / EXIT` badges. Objective meaning is now communicated by the game world itself:

- the Hidden Grove contains a small animated 32 px-style relic object that floats independently from the Page background,
- the Ruined Gate is a stateful Page environment with `sealed → opening → open` visual states,
- collecting the relic removes the world object, starts the gate-opening animation, and gives the Gate Page a restrained antique-gold pulse,
- the main HUD no longer repeats `FIND RELIC / RETURN TO EXIT`; the board remains the primary information surface.

The intended first-run reading is therefore visual rather than textual:

1. notice the animated relic in the distant Page,
2. reshape the book and explicitly travel to it,
3. watch the distant sealed gate react and open,
4. reshape or travel back to the visibly open gate and explicitly enter it.

The visual treatment extends the existing restrained antique-book system only: ink, moss, stone, parchment, antique gold, and muted seal red. No new HUD pattern or accent-color family is introduced.

## Scripts

```bash
npm ci
npm test
npm run build
npm run dev
```

Production base path: `/2D-game-playground/paper-trails/`.

Product/MVP planning lives in `../docs/plans/paper-trails/`.
