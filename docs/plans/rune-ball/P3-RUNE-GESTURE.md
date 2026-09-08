# Rune Ball — P3 Rune Gesture Gate

## Decision

P2 proved that Rune Ball already has a viable ball / destruction / rebound loop. P3 therefore does not use Rune abilities to rescue weak core feel. The only product risk in this slice is whether one-thumb directional swipes and deliberate drawn shapes can coexist without input ambiguity.

## Input contract

- short / direct paths remain directional swipes
- longer paths with clear geometric complexity become Rune candidates
- Rune recognition is deterministic geometry, not ML
- failed complex gestures produce temporary feedback and never pause the game
- normal swipe steering remains authoritative while Rune effects are active

## Rune vocabulary

### Circle — Vortex

Pulls nearby targets toward the drawn center for a short window. This changes target geometry and creates a setup opportunity rather than dealing direct damage.

### V — Split

Temporarily creates two collision-capable side echoes around the ball. The ball remains the primary readable anchor while the echoes widen the attack footprint.

### Z — Chain

Arms the next meaningful impact. That impact propagates to nearby targets, converting a setup into a local payoff burst.

## Resource model for the gate

P3 uses one shared Rune charge meter. The playtest starts fully charged so all three shapes can be exercised immediately. Each Rune costs 30 charge, while target hits and breaks recharge the meter. This is a validation economy, not final progression balance.

## Presentation rules

- no Rune buttons
- persistent UI adds only the decision-critical shared charge + glyph guide
- gesture trail is in-world and temporary
- successful recognition gets a canonical glyph confirmation beat
- failed recognition / insufficient charge is contextual and short-lived
- Rune effects reuse the existing cyan / violet / magenta visual grammar instead of adding a new UI style

## Phone gate

P3 passes only if:

1. repeated ordinary directional swipes do not accidentally activate Runes;
2. Circle, V, and Z can each be intentionally triggered after seeing the glyph once;
3. failed recognition is understandable without interrupting chase flow;
4. Vortex, Split, and Chain are mechanically distinguishable as setup / footprint / payoff tools;
5. drawing a Rune does not make the player feel that ball steering has become unreliable;
6. the Rune charge and confirmation feedback remain readable without obscuring the arena.

If recognition ambiguity is the dominant complaint, tune path sampling / intent separation / recognizer thresholds before proceeding to P4. Do not compensate with larger VFX or more generous Rune power.
