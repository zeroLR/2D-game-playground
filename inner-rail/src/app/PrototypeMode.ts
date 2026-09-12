import { MAGNETIC_VOCABULARY_TRACK } from '../track/MagneticVocabularyTrack.js';
import { MOVING_VOCABULARY_TRACK } from '../track/MovingVocabularyTrack.js';
import { VALIDATION_TRACK, type ValidationTrackDefinition } from '../track/TestTrack.js';

export interface PrototypePresentation {
  milestoneLabel: string;
  kicker: string;
  title: string;
  body: string;
}

export interface PrototypeMode {
  id: 'p0' | 'p1-magnetic' | 'p1-moving';
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
    milestoneLabel: 'P1.1 / MAGNETIC RAIL · ACCEPTED',
    kicker: 'PHYSICAL PUZZLE VOCABULARY',
    title: 'Prepare before the glow ends.',
    body: 'Accepted Magnetic Rail regression route: manage speed through the 78° wall ride and prepare momentum before the magnetic state releases onto ordinary track.',
  },
};

const P1_MOVING_MODE: PrototypeMode = {
  id: 'p1-moving',
  track: MOVING_VOCABULARY_TRACK,
  validationEnabled: false,
  presentation: {
    milestoneLabel: 'P1.2 / MOVING RAIL',
    kicker: 'PHYSICAL PUZZLE VOCABULARY',
    title: 'Read the cycle. Choose when to commit.',
    body: 'The amber bridge follows a fixed six-second lateral cycle. Wait for alignment, commit across it, or ride the moving surface and recover your timing. No countdown or automatic movement is added to your controls.',
  },
};

/**
 * P1.2 moving vocabulary is the default active prototype. Use `?stage=p0` for
 * the frozen baseline or `?stage=p1-magnetic` for the accepted P1.1 route.
 */
export function resolvePrototypeMode(search: string): PrototypeMode {
  const stage = new URLSearchParams(search).get('stage');
  if (stage === 'p0') return P0_MODE;
  if (stage === 'p1-magnetic') return P1_MAGNETIC_MODE;
  return P1_MOVING_MODE;
}
