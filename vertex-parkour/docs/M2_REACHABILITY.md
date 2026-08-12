# M2 Reachability Invariant

A generated vertical platform gap must remain below the physical rise available from the automatic jump.

Current movement constants:

- gravity: `1220 px/s²`
- auto-jump velocity: `-540 px/s`
- theoretical auto-jump rise: about `119.5 px`
- regular generated gap: `72–90 px`
- sparse/rest generated gap: `88–104 px`

The previous M2 build used a `-470 px/s` jump (about `90.5 px` rise) while the first generated platform could be `134–158 px` above the starting platform because generation started from `y=560` even though the starting platform was at `y=602`. The player therefore could never reach the first platform and repeatedly landed on the starting platform, producing an apparent in-place bounce loop.

Whenever jump physics or procedural platform spacing changes, keep a test that verifies the maximum generated vertical gap remains below the auto-jump rise with some safety margin.
