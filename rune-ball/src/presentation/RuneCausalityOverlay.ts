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
      case 'vortex-evolved':
        this.spawnEvolution('vortex', event.center, event.stage);
        break;
      case 'split-evolved':
        this.spawnEvolution('split', event.center, event.stage);
        break;
      case 'chain-evolved':
        this.spawnEvolution('chain', event.center, event.stage);
        break;
      case 'vortex-collapse':
        this.spawnCollapse(event.center, event.targets);
        break;
      case 'target-break':
        if (event.runeInfluence) this.spawnSignature(event.runeInfluence, event.position, 'break');
        break;
      case 'chain-triggered':
        this.spawnChainLinks(event.origin, event.links);
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

  private spawnEvolution(rune: RuneKind, point: Point2D, stage: 1 | 2): void {
    const group = document.createElementNS(SVG_NS, 'g');
    group.dataset.rune = rune;
    group.classList.add('rune-causality-ascension', 'rune-causality-ascension--cast');

    const radii = stage === 2 ? [38, 62, 88] : [34, 54, 72];
    for (const radius of radii) {
      const ring = document.createElementNS(SVG_NS, 'circle');
      ring.setAttribute('cx', point.x.toFixed(2));
      ring.setAttribute('cy', point.y.toFixed(2));
      ring.setAttribute('r', radius.toString());
      ring.classList.add('rune-causality-ring');
      group.append(ring);
    }

    const glyph = document.createElementNS(SVG_NS, 'path');
    glyph.setAttribute('d', this.glyphPath(rune, point, stage === 2 ? 34 : 27));
    glyph.classList.add('rune-causality-glyph');
    group.append(glyph);

    this.addTransient(group, stage === 2 ? 980 : 820);
  }

  private spawnCollapse(point: Point2D, targets: Point2D[]): void {
    const group = document.createElementNS(SVG_NS, 'g');
    group.dataset.rune = 'vortex';
    group.classList.add('rune-causality-ascension', 'rune-causality-ascension--pulse');

    for (const radius of [40, 68, 96]) {
      const ring = document.createElementNS(SVG_NS, 'circle');
      ring.setAttribute('cx', point.x.toFixed(2));
      ring.setAttribute('cy', point.y.toFixed(2));
      ring.setAttribute('r', radius.toString());
      ring.classList.add('rune-causality-ring');
      group.append(ring);
    }

    for (const target of targets) {
      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', point.x.toFixed(2));
      line.setAttribute('y1', point.y.toFixed(2));
      line.setAttribute('x2', target.x.toFixed(2));
      line.setAttribute('y2', target.y.toFixed(2));
      line.classList.add('rune-causality-link');
      group.append(line);
    }

    this.addTransient(group, 700);
  }

  private spawnChainLinks(origin: Point2D, links: { from: Point2D; to: Point2D }[]): void {
    if (links.length === 0) return;
    const group = document.createElementNS(SVG_NS, 'g');
    group.dataset.rune = 'chain';
    group.classList.add('rune-causality-chain');

    const originGlyph = document.createElementNS(SVG_NS, 'path');
    originGlyph.setAttribute('d', this.glyphPath('chain', origin, 15));
    originGlyph.classList.add('rune-causality-glyph');
    group.append(originGlyph);

    for (const link of links) {
      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', link.from.x.toFixed(2));
      line.setAttribute('y1', link.from.y.toFixed(2));
      line.setAttribute('x2', link.to.x.toFixed(2));
      line.setAttribute('y2', link.to.y.toFixed(2));
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
