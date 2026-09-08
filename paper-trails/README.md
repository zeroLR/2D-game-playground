# Paper Trails / 書頁迷城

Mobile-first antique-book spatial puzzle built with PixiJS, TypeScript, and Vite.

## Current milestone

**P5 — Authored Level Set & Tutorial Progression**

P1–P4.1.1 graph manipulation, explicit `GO →` destination semantics, route feedback, 32 px Pixel Art, animated relic objects, and stateful gates remain intact. P5 turns that vertical slice into the first complete 10-level gameplay sequence.

### Level progression

1. **TURN** — one Page rotation.
2. **MATCH** — multiple rotations / matching reciprocal exits.
3. **EXCHANGE** — swap only; rotation is disabled for the chapter.
4. **RESHAPE** — combine rotate + swap.
5. **DETOUR** — an exit is already valid; an optional relic requires deliberately breaking it.
6. **FORK** — Crossroads creates multiple valid routes.
7. **SEAL** — connectivity alone is insufficient; the animated relic must open the stateful gate.
8. **UNMAKE** — repurpose a connector by destroying an existing route.
9. **RETURN** — required relic detour followed by rebuilding the exit route.
10. **MASTERY** — all six Page families on one 3×3 board, with no new rule introduced.

Tutorial UI remains intentionally restrained. L1 uses the established rotate cue, L3 introduces swap with an in-board `↔` cue, and later levels rely on Page topology and world-state animation rather than instruction text.

Relics are data-driven per level as `none`, `optional`, or `required`. Optional relic levels can exit directly; required relic levels preserve the world-embedded `relic → gate opens` cause/effect. Merely crossing either objective never resolves it — only the explicit `GO →` destination does.

Campaign progress uses the existing local completion save and resumes at the first incomplete level. Completion shows manipulation count only after the puzzle is solved; L5 also reports whether the optional relic was found. `NEXT` advances through the campaign, `RESET` restores the exact authored initial state, and the scene respects `prefers-reduced-motion`.

## Scripts

```bash
npm ci
npm test
npm run build
npm run dev
```

Production base path: `/2D-game-playground/paper-trails/`.

Product/MVP planning lives in `../docs/plans/paper-trails/`.
