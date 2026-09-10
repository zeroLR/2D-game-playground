# P6.1.1 — Rune Onboarding + Causality Pass

## Why this pass exists

P6.1 phone testing validated the 75-second session structure, Results hierarchy, Retry reset, and background timer pause. Two product issues remain before the Authorship Gate can close:

1. the run-start affordance is functional but does not naturally teach that drawing a Rune is the primary expressive action;
2. large chain bursts still read as something the system naturally accumulates rather than something the player clearly authored with a Rune.

## Risk question

Can the first interaction teach Rune casting without a tutorial, and can subsequent Rune-caused bursts visually preserve enough causal identity that the player attributes the spectacle to their own action?

## Scope

### First-action onboarding

- Ready state shows one centered animated Circle Rune prompt.
- No modal tutorial, paragraph copy, or button.
- A successful Rune cast starts the 75-second session.
- Swipes remain recognized while Ready but do not start the timer.
- Any successful Rune may start the run; Circle is only the visual teaching example.
- The prompt disappears immediately on successful Rune activation.

### Rune causality signature

- A successful Rune creates a short-lived active signature in presentation state.
- Subsequent target breaks while that signature is active receive a matching causal accent.
- Chain propagation receives a stronger Rune-origin accent so the visual sequence reads as `cast → seeded effect → propagated break`.
- Causality treatment is visual-first and world-space; no score labels or explanatory text are added.
- Existing Rune mechanics, damage, Flow, Combo, target density, and Overdrive rules remain unchanged.

## Gate

On phone:

1. entering the Arena visually suggests drawing a Circle without reading instructions;
2. timer remains at `01:15` for swipes and starts on the first successful Rune;
3. the first successful Rune feels like the moment the run actually begins;
4. after casting a Rune, the following burst reads as connected to that cast rather than an unrelated automatic accumulation;
5. the additional signature does not obscure ball trajectory, targets, or gesture input;
6. Results / Retry / background pause behavior from P6.1 remains unchanged.

Do not proceed to P6.2 until the authorship question is materially clearer. If this visual attribution pass is insufficient, the next intervention should be authored opportunity states / formations, not more explanatory UI.
