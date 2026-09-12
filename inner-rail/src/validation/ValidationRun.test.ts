import { DEFAULT_PROTOTYPE_TUNING } from '../tuning/PrototypeTuning.js';
import { ValidationRunRecorder } from './ValidationRun.js';

const recorder = new ValidationRunRecorder();

const calibration = {
  section: 'calibration' as const,
  sectionLabel: 'CALIBRATION DECK',
  checkpointId: 'cp-start',
  checkpointIndex: 0,
  goalHoldProgress: 0,
  complete: false,
};

recorder.start(1000, 'portrait', 'device', DEFAULT_PROTOTYPE_TUNING, calibration);
recorder.recordFall();
recorder.update(4000, { ...calibration, section: 's-curve', sectionLabel: 'WIDE S-CURVE' });
recorder.update(9000, {
  ...calibration,
  section: 'goal-brake',
  sectionLabel: 'GOAL BRAKE ZONE',
  checkpointId: 'cp-brake-entry',
  checkpointIndex: 5,
});
const summary = recorder.update(12000, {
  ...calibration,
  section: 'goal-brake',
  sectionLabel: 'GOAL BRAKE ZONE',
  checkpointId: 'cp-brake-entry',
  checkpointIndex: 5,
  goalHoldProgress: 1,
  complete: true,
});

if (!summary) throw new Error('Expected validation run to complete.');
if (summary.orientation !== 'portrait' || summary.source !== 'device') {
  throw new Error('Validation run should preserve orientation and input source.');
}
if (Math.abs(summary.durationSeconds - 11) > 1e-6) {
  throw new Error(`Expected 11 second run, got ${summary.durationSeconds}.`);
}
if (summary.fallCount !== 1) throw new Error('Expected fall count to be recorded.');
if (Math.abs((summary.sectionSeconds.calibration ?? 0) - 3) > 1e-6) {
  throw new Error('Expected calibration split to be recorded.');
}
if (Math.abs((summary.sectionSeconds['s-curve'] ?? 0) - 5) > 1e-6) {
  throw new Error('Expected S-curve split to be recorded.');
}
if (Math.abs((summary.sectionSeconds['goal-brake'] ?? 0) - 3) > 1e-6) {
  throw new Error('Expected goal split to be recorded.');
}
if (recorder.update(13000, { ...calibration, complete: true }) !== null) {
  throw new Error('Completion should be emitted only once.');
}

recorder.cancel();
if (recorder.snapshot(14000).active) throw new Error('Cancelled run should be inactive.');

console.log('Inner Rail validation run tests passed.');
