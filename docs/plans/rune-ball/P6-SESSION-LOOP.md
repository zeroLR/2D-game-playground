# Rune Ball — P6.1 Session Loop + Authorship Gate

## Risk question

Can the spectacle-forward Rune loop sustain one complete 60–90 second run where the player feels they caused the chain reactions, then voluntarily wants to Retry without progression rewards?

## Session contract

`Ready → Playing → Final Release → Results → Retry`

- Total run length: **75 seconds**.
- The timer starts on the first valid Swipe or successful Rune, not on arena entry.
- The final **3 seconds** are a closing release window; controls remain unchanged.
- Results lock arena input and keep the last gameplay frame visible underneath.
- Retry creates a clean `DestructionScene` and resets the fixed-step accumulator and session statistics.
- Background / hidden time does not consume session time.

## Results hierarchy

Primary:
- Score

Secondary:
- Max Combo
- Breaks
- Rune Casts
- Overdrive Breaks
- Chain Links

The panel intentionally does not add progression, unlocks, currency, grades, or rewards. P6.1 is measuring replay desire from the core loop itself.

## Authorship instrumentation

`SessionDirector` observes the existing gameplay event stream rather than reading presentation state.

Tracked events:
- `target-break` → score, max combo, break count, Rune-attributed breaks
- `rune-activated` → total and per-Rune usage
- `chain-triggered` → trigger count and linked targets
- `overdrive-enter / exit` → Overdrive window attribution

This keeps collision, Rune, Flow, and target rules renderer-independent and unchanged.

## Scope guard

P6.1 does **not** add:
- Rune Cards / Ascension
- Overdrive Archetypes
- progression or rewards
- accounts / backend
- new target types
- gameplay balance changes
- settings panel

Sound / reduced-motion controls and final deployment hardening remain P6.2.

## Phone gate

1. After entering the arena, the timer remains at 01:15 until the first valid action.
2. A full run reaches Results in about 75 seconds of active foreground play.
3. The last 3 seconds read as a closing window without changing controls.
4. Results are understandable within 1–2 seconds and Score is the dominant value.
5. Retry returns immediately to a clean Ready state and a second run behaves normally.
6. Switching the page to background pauses both audio and session time.
7. The player can tell that Rune timing / choice materially contributed to the spectacle rather than feeling like a passive screensaver.
8. The player has a natural desire to Retry at least once without meta rewards.

## Decision after gate

- If replay desire and authorship both pass, proceed to **P6.2 — Production Controls + Deploy Gate**.
- If spectacle is satisfying but authorship is weak, adjust authored opportunity states / formations and cause→effect feedback before adding progression.
- Do not solve weak authorship by adding a second control mode or precision targeting by default.
