import { COMPOSED_VOCABULARY_TRACK } from '../track/ComposedVocabularyTrack.js';
import { GENERALIZED_COMPOSITION_TRACK } from '../track/GeneralizedCompositionTrack.js';
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
  id: 'p0' | 'p1-magnetic' | 'p1-moving' | 'p1-composition' | 'p1-generalization';
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
    body: 'Isolated Moving Rail regression route. The amber bridge follows a fixed lateral cycle without a countdown or new player input.',
  },
};

const P1_COMPOSITION_MODE: PrototypeMode = {
  id: 'p1-composition',
  track: COMPOSED_VOCABULARY_TRACK,
  validationEnabled: false,
  presentation: {
    milestoneLabel: 'P1.3 / MAGNETIC SHUTTLE · ACCEPTED',
    kicker: 'FIRST MECHANIC COMPOSITION',
    title: 'Stay attached. Leave on alignment.',
    body: 'Accepted first composition: ride the 48° magnetic shuttle sideways and commit to the opposite receiver when the surfaces align.',
  },
};

const P1_GENERALIZATION_MODE: PrototypeMode = {
  id: 'p1-generalization',
  track: GENERALIZED_COMPOSITION_TRACK,
  validationEnabled: false,
  presentation: {
    milestoneLabel: 'P1.4 / COMPOSITION GENERALIZATION',
    kicker: 'SYSTEM DEPTH GATE',
    title: 'Ride upward. Prepare before the upper dock arrives.',
    body: 'Board the short 36° magnetic lift at the lower dock. Hold your position while the same surface rises, then prepare forward momentum so you can transfer onto the upper magnetic receiver during its docking window. No new mechanic or input is added.',
  },
};

/**
 * P1.4 is the active prototype. Earlier isolated and first-composition routes
 * remain available for regression and direct A/B comparison.
 */
export function resolvePrototypeMode(search: string): PrototypeMode {
  const stage = new URLSearchParams(search).get('stage');
  if (stage === 'p0') return P0_MODE;
  if (stage === 'p1-magnetic') return P1_MAGNETIC_MODE;
  if (stage === 'p1-moving') return P1_MOVING_MODE;
  if (stage === 'p1-composition') return P1_COMPOSITION_MODE;
  return P1_GENERALIZATION_MODE;
}
