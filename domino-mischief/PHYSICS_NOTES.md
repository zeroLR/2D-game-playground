# Domino chain physics diagnosis

The chain failure after PR #200 is primarily a sleep-state problem, not a mass problem.

All dominoes are explicitly put to sleep during level setup. On push, every body was woken at the same time, but downstream stationary dominoes could become sleepy/asleep again before the falling wave reached them. That makes collision-driven propagation unreliable.

Prototype baseline:

- keep domino bodies sleeping only while the level is waiting to start;
- when the player presses Push, disable sleeping for every domino for the duration of the run;
- clear stale linear/angular velocity before applying the first tipping impulse;
- use collision physics to propagate the chain; do not script impulses into later dominoes.

Mass remains uniform because changing every domino to the same lower mass does not by itself improve same-mass momentum transfer.
