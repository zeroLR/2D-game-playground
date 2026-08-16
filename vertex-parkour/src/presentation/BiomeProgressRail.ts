import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { BIOME_SEQUENCE, type BiomeId } from '../world/Biome';
import { getBiomeTheme } from './BiomeTheme';

const LABELS: Record<BiomeId, string> = {
  'teal-ruins': 'TEAL',
  'amber-district': 'AMBER',
  'violet-zone': 'VIOLET',
  'pale-heights': 'PALE',
  'storm-crown': 'CROWN',
};

const RAIL_X = 9;
const START_Y = 0;
const STEP_Y = 38;

export class BiomeProgressRail {
  readonly view = new Container();
  private readonly rail = new Graphics();
  private readonly labels = new Map<BiomeId, Text>();
  private activeBiome: BiomeId | null = null;

  constructor() {
    this.view.alpha = 0.72; this.view.addChild(this.rail);
    for (const [index, biome] of BIOME_SEQUENCE.entries()) {
      const label = new Text({ text: LABELS[biome], style: new TextStyle({ fill: '#9eb8b5', fontSize: 6.5, fontWeight: '600', letterSpacing: 0.5 }) });
      label.position.set(RAIL_X + 10, START_Y + index * STEP_Y - 4); this.labels.set(biome, label); this.view.addChild(label);
    }
    this.update('teal-ruins');
  }

  update(activeBiome: BiomeId) {
    if (this.activeBiome === activeBiome) return;
    this.activeBiome = activeBiome;
    const activeIndex = BIOME_SEQUENCE.indexOf(activeBiome); const endY = START_Y + (BIOME_SEQUENCE.length - 1) * STEP_Y;
    this.rail.clear(); this.rail.moveTo(RAIL_X, START_Y).lineTo(RAIL_X, endY).stroke({ width: 1, color: 0x789b99, alpha: 0.18 });
    for (const [index, biome] of BIOME_SEQUENCE.entries()) {
      const theme = getBiomeTheme(biome); const completed = index < activeIndex; const active = index === activeIndex;
      const alpha = active ? 0.95 : completed ? 0.52 : 0.18; const radius = active ? 3.4 : 2.4; const y = START_Y + index * STEP_Y;
      if (completed && index < BIOME_SEQUENCE.length - 1) {
        const nextY = START_Y + (index + 1) * STEP_Y;
        this.rail.moveTo(RAIL_X, y).lineTo(RAIL_X, nextY).stroke({ width: 1.3, color: theme.platformTint, alpha: 0.42 });
      }
      this.rail.circle(RAIL_X, y, radius).fill({ color: theme.platformTint, alpha });
      const label = this.labels.get(biome);
      if (label) { label.style.fill = theme.platformTint; label.alpha = active ? 0.9 : completed ? 0.5 : 0.2; }
    }
  }
}
