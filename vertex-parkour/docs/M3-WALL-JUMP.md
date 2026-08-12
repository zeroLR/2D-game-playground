# M3.2 — Wall Interaction / Wall Jump

## Goal

Add walls as forgiving traversal nodes, not precision obstacles.

## Rules

- Wall segments appear periodically on the left or right traversal boundary.
- Contacting a wall while airborne enters a slow wall slide.
- Wall contact restores the tactical Dash, matching platform/Crystal/Drone traversal reset semantics.
- Swipe **away from the contacted wall** to wall-jump.
- Wall jump supplies upward + outward velocity and does not consume Dash.
- A short lockout prevents immediately snapping back onto the same wall.
- Existing short-swipe Air Nudge and long-swipe Dash remain unchanged away from walls.

## Intended loop

`jump → nudge → wall contact → swipe away → wall jump → dash → platform/drone/crystal`

## Mobile validation

1. Wall contact should feel like a rescue opportunity rather than a punishment.
2. The player should visibly slow while sliding down the wall.
3. Swiping away should consistently launch away and upward.
4. After wall jump, Dash should still be available.
5. Missing a platform but reaching a nearby wall should sometimes save the run.

## Non-goals

- No wall climb.
- No repeated same-wall infinite climb.
- No extra button or vertical swipe gesture.
- No breakable walls yet.
