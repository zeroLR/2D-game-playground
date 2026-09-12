import { MAGNETIC_VOCABULARY_TRACK } from '../track/MagneticVocabularyTrack.js';
import { VALIDATION_TRACK, type ValidationTrackDefinition } from '../track/TestTrack.js';

export interface PrototypePresentation {
  milestoneLabel: string;
  kicker: string;
  title: string;
  body: string;
}

export interface PrototypeMode {
  id: 'p0' | 'p1-magnetic';
  track: ValidationTrackDefinition;
  validationEnabled: boolean;
  presentation: PrototypePresentation;
}

const P0_MODE: PrototypeMode = {
  id: 'p0',
  track: VALIDATION_TRACK,
  validationEnabled: true,
  presentation: {
    milestoneLabel: 'P0.4',
    kicker: 'PHONE FEEL / COMFORT GATE',
    title: 'One track. One physical rule.',
    body: 'Run the validation course, tune only what changes control readability, and compare portrait vs landscape under the same rule set.',
  },
};

const P1_MAGNETIC_MODE: PrototypeMode = {
  id: 'p1-magnetic',
  track: MAGNETIC_VOCABULARY_TRACK,
  validationEnabled: false,
  presentation: {
    milestoneLabel: 'P1.1.2 / MAGNETIC WALL RIDE',
    kicker: 'PHYSICAL PUZZLE VOCABULARY',
    title: 'Follow the surface, not the seam.',
    body: 'The luminous rail now rolls gradually into a steep 78° wall ride. Magnetic gravity keeps the surface as down while the same forward/back tilt controls momentum; full inversion comes later only if this transition reads naturally.',
  },
};

/**
 * P1 magnetic vocabulary is the default active prototype. `?stage=p0` keeps
 * the frozen P0 validation track available for regression and external tests.
 */
export function resolvePrototypeMode(search: string): PrototypeMode {
  const stage = new URLSearchParams(search).get('stage');
  return stage === 'p0' ? P0_MODE : P1_MAGNETIC_MODE;
}
