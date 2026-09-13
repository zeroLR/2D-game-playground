import { COMPACT_PUZZLE_ROOM_TRACK } from '../track/CompactPuzzleRoomTrack.js';
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
  id:
    | 'p0'
    | 'p1-magnetic'
    | 'p1-moving'
    | 'p1-composition'
    | 'p1-generalization'
    | 'p2-room';
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
    milestoneLabel: 'P1.4 / COMPOSITION GENERALIZATION · ACCEPTED',
    kicker: 'SYSTEM DEPTH GATE',
    title: 'Ride upward. Prepare before the upper dock arrives.',
    body: 'Accepted second composition: control position on the vertical magnetic lift and prepare momentum before leaving for the upper receiver.',
  },
};

const P2_ROOM_MODE: PrototypeMode = {
  id: 'p2-room',
  track: COMPACT_PUZZLE_ROOM_TRACK,
  validationEnabled: false,
  presentation: {
    milestoneLabel: 'P2.1 / COMPACT PUZZLE ROOM',
    kicker: 'SPATIAL PUZZLE GRAMMAR',
    title: 'You can see the goal. Find the route that reaches its height.',
    body: 'Read the room before committing. The route folds around the same chamber, rises on the magnetic lift, crosses the upper moving bridge, then returns over previously seen space. No minimap, waypoint, switch, or new control is added.',
  },
};

/**
 * P2.1 is the active prototype. P0/P1 routes remain selectable for regression
 * so spatial-design changes can be separated from physics vocabulary changes.
 */
export function resolvePrototypeMode(search: string): PrototypeMode {
  const stage = new URLSearchParams(search).get('stage');
  if (stage === 'p0') return P0_MODE;
  if (stage === 'p1-magnetic') return P1_MAGNETIC_MODE;
  if (stage === 'p1-moving') return P1_MOVING_MODE;
  if (stage === 'p1-composition') return P1_COMPOSITION_MODE;
  if (stage === 'p1-generalization') return P1_GENERALIZATION_MODE;
  return P2_ROOM_MODE;
}
