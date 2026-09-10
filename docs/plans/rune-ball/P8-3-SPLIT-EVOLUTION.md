# Rune Ball — P8.3 Split Evolution Gate

## Risk question

**Can Split support two evolution paths that produce meaningfully different attack geometry, proving the Rune Evolution architecture works beyond Vortex?**

## Build paths

### Prism — Coverage / Spread

`Split → Refraction → Aurora Prism`

- Base: two lateral echoes.
- T1: four-point attack fan.
- T2: six-point wide sweep.

### Lance — Focus / Pierce

`Split → Convergence → Void Lance`

- Base: two lateral echoes.
- T1: echoes collapse toward the forward travel axis.
- T2: a longer three-point forward pressure column.

## Evolution trigger

A Split cast earns at most one qualified use, and only after a Split echo actually hits a target. Drawing `V` into empty space or activating Split without an echo contact does not progress evolution. Thresholds remain 3 → T1 and 6 → T2.

## UX contract

- Split is now an authored Rune card in Rune Tree.
- Tree remains glyph-first; names and mechanics stay in the detail surface.
- Tapping any Prism/Lance node switches that path directly and persists it in PlayerProfile.
- Gameplay keeps one compact evolution status; it switches context to the authored Rune that most recently progressed.
- Auto-evolution is primarily communicated by world feedback, not a modal or extra gameplay button.

## Scope guard

No Chain evolution, new stages, run economy, Overdrive Archetypes, progression currency, backend/account work, or Production Pages Smoke.

## Phone gate

1. Prism clearly feels like wider attack coverage rather than just more particles.
2. Lance rewards intentional travel direction and feels focused rather than weaker.
3. Empty Split casts do not appear to advance evolution.
4. T1/T2 auto-evolution is noticeable without interrupting play.
5. Rune Tree path switching remains immediate and the two Split branches are visually distinguishable.
6. Adding Split progression does not make the lower HUD feel crowded.
