# Rune Ball — P7.1 Rune Card Interaction Gate

## Status

Post-MVP exploration. The deferred Production Pages Smoke Gate is not a prerequisite for this design track.

## Risk question

Can Rune Ball add one deliberate card-tap release without weakening its gesture-first identity or pulling attention away from the arena?

The test is not whether an ultimate meter can be implemented. The test is whether this second decision layer creates a meaningful rhythm:

```text
Draw Vortex
→ charge Vortex Card
→ notice Ready state
→ choose a release moment
→ tap once
→ Singularity qualitatively evolves Vortex
→ return immediately to Swipe / Rune play
```

## P7.1 vertical slice

Only one equipped card is implemented:

- Base Rune: **Vortex / Circle**
- Ascension: **Singularity**
- Four successful Vortex activations charge the card from 0 → 100.
- Split and Chain do not contribute to this card.
- Additional Vortex casts while full do not overflow or auto-release.
- The card is only interactive while fully charged and the gameplay runtime is active.
- Tap consumes the stored charge only after the gameplay domain accepts the release.
- Retry resets Ascension Energy.

## Singularity behavior

Singularity is intentionally not a flat damage buff and is not a second way to cast normal Vortex.

On release:

1. The effect is anchored to the ball's current position.
2. A larger, stronger Vortex field pulls perimeter targets inward for a short authored window.
3. The field resolves into a collapse pulse.
4. Pulse damage is attributed to Vortex for the existing causality language and run statistics.

This preserves the base Rune identity:

`Vortex = gathering / setup`

while making the upper tier read as:

`Singularity = large-scale gathering → collapse payoff`

## UI contract

The first prototype deliberately shows only one card. Do not scale to three cards until this interaction passes.

- Bottom-safe-area placement, outside the central interaction lane whenever possible.
- Charging state is quiet and non-interactive.
- One thin edge meter communicates charge; no badges or second meter.
- Fully charged state gains a clear cyan affordance and becomes a touch target.
- Card label changes from charge percentage to `SINGULARITY READY`.
- Card taps are isolated from the Pixi gesture surface.
- Settings / background / Results disable the card together with gameplay input.
- Reduced Motion removes nonessential pulsing / large transform motion.

## Scope guard

P7.1 does **not** add:

- Split or Chain cards
- Rune loadout selection
- inventory / rarity / upgrades
- persistent meta progression
- Overdrive Archetypes
- cross-system synergy
- currency or rewards
- a second base-Rune cast button
- balance changes to the existing base Runes

## Phone gate

1. The charging card is visible when looked for but does not compete with Ball / targets / gesture trace.
2. After several Vortex casts, the player notices that the card is becoming ready without staring at it continuously.
3. `SINGULARITY READY` reads as tappable without explanatory tutorial text.
4. Tapping the ready card does not accidentally create a Rune path or interrupt immediate Swipe control afterward.
5. Singularity clearly reads as an upper-tier Vortex: targets gather inward, then the collapse resolves.
6. The player chooses *when* to release rather than tapping instantly every time it becomes ready.
7. Four-cast charging does not create an obvious low-value Vortex-spam incentive.
8. If the single-card interaction passes, P7.2 may expand the same contract to Split and Chain. If it fails, do not build the other two cards.
