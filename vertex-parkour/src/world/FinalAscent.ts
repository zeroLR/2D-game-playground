import type { WorldSpawn } from './WorldGenerator';

export type FinalAscentStage =
  | 'storm-gate'
  | 'fractured-transfer'
  | 'wall-rescue'
  | 'moving-bridge'
  | 'pursuit'
  | 'storm-commitment'
  | 'crown-steps'
  | 'summit-approach';

export type FinalAscentBand = {
  stage: FinalAscentStage;
  y: number;
  spawns: WorldSpawn[];
};

const GAP = 86;

/**
 * Authored Chapter 1 capstone traversal.
 *
 * The sequence deliberately remixes previously learned mechanics while keeping
 * each beat readable. It terminates on a large stable summit-approach shelf;
 * Slice 3C owns the actual chapter-exit entity and clear interaction.
 */
export function buildFinalAscent(startY: number): FinalAscentBand[] {
  let y = startY;
  const nextY = (extra = 0) => (y -= GAP + extra);

  const gateY = nextY(4);
  const fractureY = nextY();
  const wallY = nextY(2);
  const bridgeY = nextY(8);
  const pursuitY = nextY();
  const commitmentY = nextY(8);
  const crownY = nextY();
  const summitY = nextY(12);

  return [
    {
      stage: 'storm-gate',
      y: gateY,
      spawns: [
        { type: 'platform', x: 82, y: gateY, width: 104 },
        { type: 'pulse-gate', x: 180, y: gateY - 48, height: 104, phase: 0.35 },
      ],
    },
    {
      stage: 'fractured-transfer',
      y: fractureY,
      spawns: [
        { type: 'platform', x: 116, y: fractureY + 5, width: 48 },
        { type: 'platform', x: 242, y: fractureY - 5, width: 52 },
      ],
    },
    {
      stage: 'wall-rescue',
      y: wallY,
      spawns: [
        { type: 'platform', x: 278, y: wallY, width: 92 },
        { type: 'wall', side: -1, y: wallY - 44, height: 146 },
      ],
    },
    {
      stage: 'moving-bridge',
      y: bridgeY,
      spawns: [
        {
          type: 'platform',
          x: 180,
          y: bridgeY,
          width: 78,
          motion: { axis: 'x', amplitude: 62, speed: 1.08, phase: 1.15, originX: 180 },
        },
      ],
    },
    {
      stage: 'pursuit',
      y: pursuitY,
      spawns: [
        { type: 'platform', x: 82, y: pursuitY, width: 94 },
        { type: 'interceptor', x: 278, y: pursuitY - 46, phase: 2.1 },
      ],
    },
    {
      stage: 'storm-commitment',
      y: commitmentY,
      spawns: [
        { type: 'platform', x: 278, y: commitmentY, width: 96 },
        { type: 'spike', x: 250, y: commitmentY - 10, width: 18 },
      ],
    },
    {
      stage: 'crown-steps',
      y: crownY,
      spawns: [
        { type: 'platform', x: 126, y: crownY + 8, width: 70 },
        { type: 'platform', x: 236, y: crownY - 8, width: 76 },
      ],
    },
    {
      stage: 'summit-approach',
      y: summitY,
      spawns: [{ type: 'platform', x: 180, y: summitY, width: 154 }],
    },
  ];
}

export function finalAscentTopY(startY: number): number {
  const bands = buildFinalAscent(startY);
  return bands[bands.length - 1].y;
}
