import { TrackProgress } from './TrackProgress.js';
import { VALIDATION_TRACK } from './TestTrack.js';

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`);
}

function assertClose(actual: number, expected: number, epsilon = 1e-6): void {
  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(`Expected ${actual} to be within ${epsilon} of ${expected}`);
  }
}

const progress = new TrackProgress(VALIDATION_TRACK);
let snapshot = progress.snapshot(VALIDATION_TRACK.start.position);
assertEqual(snapshot.checkpointId, 'cp-start', 'Track should begin at the authored start checkpoint');
assertEqual(snapshot.section, 'calibration', 'Spawn should read as the calibration section');

const narrowExit = VALIDATION_TRACK.checkpoints[2];
progress.update(narrowExit.trigger, 2, 1 / 60);
snapshot = progress.snapshot(narrowExit.trigger);
assertEqual(snapshot.checkpointId, 'cp-narrow-exit', 'Crossing a later authored checkpoint should advance recovery');
assertEqual(progress.recoveryPose(), narrowExit.pose, 'Recovery should use the latest authored checkpoint pose');

const goalPosition = VALIDATION_TRACK.goal.center;
progress.update(goalPosition, VALIDATION_TRACK.goal.maxSpeed + 0.5, 0.1);
snapshot = progress.snapshot(goalPosition);
assertClose(snapshot.goalHoldProgress, 0);
assertEqual(snapshot.complete, false, 'Entering the goal too fast must not complete the run');

for (let elapsed = 0; elapsed < VALIDATION_TRACK.goal.holdSeconds + 0.1; elapsed += 0.1) {
  progress.update(goalPosition, VALIDATION_TRACK.goal.maxSpeed * 0.5, 0.1);
}
snapshot = progress.snapshot(goalPosition);
assertEqual(snapshot.complete, true, 'Braking and holding inside the goal should complete the run');
assertClose(snapshot.goalHoldProgress, 1);

console.log('Inner Rail track progress tests passed.');
