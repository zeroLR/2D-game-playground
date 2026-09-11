import type { TiltSnapshot } from '../input/TiltInput';

function fixed(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : value.toFixed(2);
}

function viewportOrientation(): 'portrait' | 'landscape' {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

export class PrototypeTelemetry {
  constructor(private readonly root: HTMLElement) {}

  render(snapshot: TiltSnapshot): void {
    const raw = snapshot.raw;
    this.root.textContent = [
      `source      ${snapshot.source ?? 'none'}`,
      `viewport    ${viewportOrientation()}  ${window.innerWidth}×${window.innerHeight}`,
      `screen deg  x ${fixed(snapshot.screenTiltDeg.x)}  y ${fixed(snapshot.screenTiltDeg.y)}`,
      `neutral     x ${fixed(snapshot.neutral?.x)}  y ${fixed(snapshot.neutral?.y)}`,
      `relative    x ${fixed(snapshot.relativeTiltDeg.x)}  y ${fixed(snapshot.relativeTiltDeg.y)}`,
      `filtered    x ${fixed(snapshot.normalized.x)}  y ${fixed(snapshot.normalized.y)}`,
      `gravity     x ${fixed(snapshot.gravityDirection.x)}  y ${fixed(snapshot.gravityDirection.y)}  z ${fixed(snapshot.gravityDirection.z)}`,
      `raw beta    ${fixed(raw?.betaDeg)}  gamma ${fixed(raw?.gammaDeg)}  screen ${fixed(raw?.screenAngleDeg)}`,
    ].join('\n');
  }
}
