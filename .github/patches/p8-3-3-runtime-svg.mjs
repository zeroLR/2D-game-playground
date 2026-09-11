import fs from 'node:fs';

const path = 'rune-ball/src/presentation/DestructionScene.ts';
let source = fs.readFileSync(path, 'utf8');

function replaceOnce(before, after, label) {
  if (!source.includes(before)) throw new Error(`Missing patch anchor: ${label}`);
  source = source.replace(before, after);
}

replaceOnce(
  "import { getSplitVisualProfile } from './SplitVisualIdentity';",
  "import { SplitRuntimeSvg } from './SplitRuntimeSvg';",
  'Split runtime import',
);

replaceOnce(
  '  private readonly runeFx = new Graphics();\n  private readonly overdriveFx = new Graphics();',
  '  private readonly runeFx = new Graphics();\n  private readonly splitRuntimeSvg = new SplitRuntimeSvg();\n  private readonly overdriveFx = new Graphics();',
  'Split runtime field',
);

replaceOnce(
  '      this.runeFx,\n      this.impactPool,',
  '      this.runeFx,\n      this.splitRuntimeSvg,\n      this.impactPool,',
  'Split runtime layer order',
);

replaceOnce(
`    this.drawBreakRings(overdrive);
    this.drawRuneEffects(
      snapshot.ball.position,
      snapshot.ball.velocity,
      snapshot.splitEchoes,
      snapshot.splitEvolution.path,
      snapshot.splitEvolution.stage,
      snapshot.runes.vortexCenter,`,
`    this.drawBreakRings(overdrive);
    this.splitRuntimeSvg.present(
      position,
      snapshot.ball.velocity,
      snapshot.splitEchoes.length > 0,
      snapshot.splitEvolution.path,
      snapshot.splitEvolution.stage,
      this.presentationTime,
      this.reducedMotion,
      overdrive,
    );
    this.drawRuneEffects(
      snapshot.ball.position,
      snapshot.splitEchoes,
      snapshot.runes.vortexCenter,`,
  'Runtime presentation call',
);

replaceOnce(
`  private drawRuneEffects(
    ballPosition: Point2D,
    ballVelocity: Point2D,
    splitEchoes: Point2D[],
    splitPath: SplitEvolutionPath,
    splitStage: SplitEvolutionStage,
    vortexCenter: Point2D | null,`,
`  private drawRuneEffects(
    ballPosition: Point2D,
    splitEchoes: Point2D[],
    vortexCenter: Point2D | null,`,
  'Rune effect signature',
);

replaceOnce(
  '    this.drawSplitIdentity(ballPosition, ballVelocity, splitEchoes, splitPath, splitStage, overdrive);',
  '    this.drawSplitCollisionHints(ballPosition, splitEchoes, overdrive);',
  'Split identity call',
);

const methodPattern = /  private drawSplitIdentity\([\s\S]*?\n  private drawOverdriveBeats\(\): void \{/;
if (!methodPattern.test(source)) throw new Error('Missing patch anchor: drawSplitIdentity method');
source = source.replace(methodPattern, `  private drawSplitCollisionHints(
    ballPosition: Point2D,
    splitEchoes: Point2D[],
    overdrive: boolean,
  ): void {
    if (splitEchoes.length === 0) return;
    const lineAlpha = overdrive ? 0.14 : 0.075;
    const markAlpha = overdrive ? 0.30 : 0.16;

    for (const echo of splitEchoes) {
      this.runeFx
        .moveTo(ballPosition.x, ballPosition.y)
        .lineTo(echo.x, echo.y)
        .stroke({ color: COLORS.violet, width: 1, alpha: lineAlpha });
      this.runeFx
        .poly([
          echo.x, echo.y - 3.5,
          echo.x + 3.5, echo.y,
          echo.x, echo.y + 3.5,
          echo.x - 3.5, echo.y,
        ])
        .stroke({ color: COLORS.cyan, width: 1.2, alpha: markAlpha });
    }
  }

  private drawOverdriveBeats(): void {`);

fs.writeFileSync(path, source);
