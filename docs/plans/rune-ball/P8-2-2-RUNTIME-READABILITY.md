# Rune Ball — P8.2.2 Runtime Readability Refinement

## Risk question

**Can the Rune Tree communicate gameplay effects rather than input notation, while the run HUD reads as one deliberate telemetry system instead of several independently positioned labels?**

## Decisions

- Rune cards remain the gesture / identity surface.
- Tree Base nodes use effect semantics: Vortex field, Split echoes, Chain propagation.
- Tapping evolution nodes continues to switch the active path immediately.
- Orbit T1 lasts 1.70s; Event Horizon T2 lasts 2.40s. Gravity tuning is unchanged.
- Time, Score, and Combo share one top telemetry row. Flow/Overdrive remains immediately above the collision frame.
- Arena and Rune gutters remain unchanged so the cleaner HUD does not reduce gesture room.

## Phone gate

1. Base Rune nodes read as skill effects rather than drawing instructions.
2. Time is visually primary; Score and Combo flank it without competing for attention.
3. Flow/Overdrive reads as the transition from telemetry into the Arena rather than another floating HUD element.
4. Orbit feels clearly sustained without becoming a long passive lock state.
5. Short-phone gesture space remains unchanged.
