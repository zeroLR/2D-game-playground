# Domino physics baseline

The first prototype is the acceptance baseline for all later level geometry.

## Acceptance

- 20 upright dominoes on a straight path.
- One high-face impulse is applied only to the first domino.
- No scripted forces are applied to downstream dominoes.
- Within five simulated seconds, the final domino must leave the upright state.

`npm test` executes this deterministic cannon-es smoke test in addition to TypeScript checking.

Only after this baseline remains green should spacing or geometry be specialized for corners and curves.
