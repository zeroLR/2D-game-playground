import type { DestructionEvent } from '../game/DestructionSession';
import type { Point2D } from '../input/SwipeClassifier';
import type { RuneKind } from '../rune/RuneTypes';

const SVG_NS = 'http://www.w3.org/2000/svg';
const MAX_TRANSIENTS = 24;

export class RuneCausalityOverlay {
  private readonly root: SVGSVGElement;
  private readonly timers = new Set<number>();

  constructor(host: HTMLElement) {
    const root = document.createElementNS(SVG_NS, 'svg');
    root.classList.add('rune-causality');
    root.setAttribute('aria-hidden', 'true');
    host.append(root);
    this.root = root;
  }

  handle(event: DestructionEvent): void {
    switch (event.type) {
      case 'rune-activated':
        this.spawnSignature(event.rune, event.center, 'cast');
        break;
      case 'ascension-activated':
        this.spawnAscension(event.center, false);
        break;
      case 'ascension-pulse':
        this.spawnAscension(event.center, true);
        break;
      case 'target-break':
        if (event.runeInfluence) this.spawnSignature(event.runeInfluence, event.position, 'break');
        break;
      case 'chain-triggered':
        this.spawnChainLinks(event.origin, event.targets);
        break;
      default:
        break;
    }
  }

  reset(): void {
    for (const timer of this.timers) window.clearTimeout(timer);
    this.timers.clear();
    this.root.replaceChildren();
  }

  destroy(): void {
    this.reset();
    this.root.remove();
  }

  private spawnSignature(rune: RuneKind, point: Point2D, variant: 'cast' | 'break'): void {
    const group = document.createElementNS(SVG_NS, 'g');
    group.dataset.rune = rune;
    group.classList.add('rune-causality-signature', `rune-causality-signature--${variant}`);

    const ring = document.createElementNS(SVG_NS, 'circle');
    ring.setAttribute('cx', point.x.toFixed(2));
    ring.setAttribute('cy', point.y.toFixed(2));
    ring.setAttribute('r', variant === 'cast' ? '30' : '22');
    ring.classList.add('rune-causality-ring');
    group.append(ring);

    const glyph = document.createElementNS(SVG_NS, 'path');
    glyph.setAttribute('d', this.glyphPath(rune, point, variant === 'cast' ? 18 : 13));
    glyph.classList.add('rune-causality-glyph');
    group.append(glyph);

    this.addTransient(group, variant === 'cast' ? 720 : 560);
  }

  private spawnAscension(point: Point2D, pulse: boolean): void {
    const group = document.createElementNS(SVG_NS, 'g');
    group.dataset.rune = 'vortex';
    group.classList.add('rune-causality-ascension', pulse ? 'rune-causality-ascension--pulse' : 'rune-causality-ascension--cast');

    for (const radius of pulse ? [40, 68, 96] : [34, 54, 74]) {
      const ring = document.createElementNS(SVG_NS, 'circle');
      ring.setAttribute('cx', point.x.toFixed(2));
      ring.setAttribute('cy', point.y.toFixed(2));
      ring.setAttribute('r', radius.toString());
      ring.classList.add('rune-causality-ring');
      group.append(ring);
    }

    const glyph = document.createElementNS(SVG_NS, 'path');
    glyph.setAttribute('d', this.glyphPath('vortex', point, pulse ? 34 : 27));
    glyph.classList.add('rune-causality-glyph');
    group.append(glyph);

    this.addTransient(group, pulse ? 680 : 900);
  }

  private spawnChainLinks(origin: Point2D, targets: Point2D[]): void {
    if (targets.length === 0) return;
    const group = document.createElementNS(SVG_NS, 'g');
    group.dataset.rune = 'chain';
    group.classList.add('rune-causality-chain');

    const originGlyph = document.createElementNS(SVG_NS, 'path');
    originGlyph.setAttribute('d', this.glyphPath('chain', origin, 15));
    originGlyph.classList.add('rune-causality-glyph');
    group.append(originGlyph);

    for (const target of targets) {
      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', origin.x.toFixed(2));
      line.setAttribute('y1', origin.y.toFixed(2));
      line.setAttribute('x2', target.x.toFixed(2));
      line.setAttribute('y2', target.y.toFixed(2));
      line.classList.add('rune-causality-link');
      group.append(line);
    }

    this.addTransient(group, 520);
  }

  private glyphPath(rune: RuneKind, point: Point2D, size: number): string {
    const { x, y } = point;
    switch (rune) {
      case 'vortex':
        return `M ${x + size} ${y} A ${size} ${size} 0 1 1 ${x - size} ${y} A ${size} ${size} 0 1 1 ${x + size} ${y}`;
      case 'split':
        return `M ${x - size} ${y - size * 0.72} L ${x} ${y + size} L ${x + size} ${y - size * 0.72}`;
      case 'chain':
        return `M ${x - size} ${y - size * 0.72} L ${x + size} ${y - size * 0.72} L ${x - size} ${y + size * 0.72} L ${x + size} ${y + size * 0.72}`;
    }
  }

  private addTransient(node: SVGElement, lifetimeMs: number): void {
    while (this.root.childElementCount >= MAX_TRANSIENTS) this.root.firstElementChild?.remove();
    this.root.append(node);
    const timer = window.setTimeout(() => {
      node.remove();
      this.timers.delete(timer);
    }, lifetimeMs);
    this.timers.add(timer);
  }
}
