# Rune Ball — P4 Flow + Overdrive Gate

## Risk question

Can the validated Swipe → Rebound → Break → Rune loop naturally escalate into one memorable power-fantasy climax, rather than Overdrive reading as only a faster / brighter version of normal play?

## Escalation model

```text
Meaningful offense
  → Flow buildup
  → Flow threshold
  → 12s Overdrive
  → temporary rule changes
  → release / return to normal play
```

### Flow sources

Flow is gameplay-earned, not time-earned:

- normal target contact: small gain
- target break: primary gain
- Rune activation: setup gain
- Chain propagation: secondary payoff gain

P4 intentionally allows only one Overdrive activation per mechanic-gate session. P6 will own the final 60–90 second session director and timing calibration.

## Overdrive rule changes

During Overdrive:

- Rune effective cost becomes zero
- active Combo cannot decay
- desired target density increases from 8 to 11
- new targets still materialize through the existing chase-aware director
- impact particles use a higher temporary tier
- ball trail, Rune feedback, break rings, arena perimeter, and entry shockwave move to the Overdrive visual tier

Overdrive does **not** add a second control mode, new buttons, or automatic attacks. Swipe and Rune gestures remain the player's primary verbs.

## UI contract

Persistent information stays compact:

- the existing top-center status becomes Flow percentage before Overdrive and countdown during Overdrive
- one thin bar represents Flow buildup, then converts to remaining Overdrive duration
- `COMBO // LOCK` appears only during Overdrive
- Rune readiness changes to `RUNE FREE` during Overdrive

No new modal, buff tray, or permanent Overdrive panel is introduced.

## Scope guard

Out of scope for P4:

- final audio design
- final camera punch / distortion / bloom tuning
- full VFX characterization and device quality tiers
- run timer / results / retry
- meta progression
- additional Rune types

Those belong to P5 / P6 after the escalation loop itself is validated.

## Phone playtest gate

A competent playtest should answer:

1. Does Flow buildup feel connected to playing well rather than passive waiting?
2. Does Overdrive arrive at a satisfying cadence rather than immediately or never?
3. On entry, is the state change unmistakable within a fraction of a second?
4. Do free Runes + protected Combo + higher target density materially change what the player can do?
5. Does the arena remain readable during dense Rune / Chain / Rebound overlap?
6. Does the end of Overdrive feel like a completed release rather than an arbitrary buff timeout?
7. Can the player clearly describe normal buildup versus Overdrive climax afterward?

If the dominant feedback is only “it is brighter / busier / faster,” P4 fails even if the state machine is technically correct.
