import type { Piece } from '../board/model';

export class MatchSystem {
  private candidates = new Map<string, number>();

  clear() { this.candidates.clear(); }

  scan(pieces: Piece[], now: number): Piece[] | null {
    const current = this.groups(pieces);
    const keys = new Set<string>();
    for (const group of current) {
      const key = group.map(p => p.id).sort((a, b) => a - b).join(':');
      keys.add(key);
      const since = this.candidates.get(key);
      if (since === undefined) this.candidates.set(key, now);
      else if (now - since >= 200) { this.clear(); return group; }
    }
    for (const key of [...this.candidates.keys()]) if (!keys.has(key)) this.candidates.delete(key);
    return null;
  }

  private groups(pieces: Piece[]): Piece[][] {
    const alive = pieces.filter(p => !p.removing), seen = new Set<Piece>(), out: Piece[][] = [];
    for (const root of alive) {
      if (seen.has(root)) continue;
      const group: Piece[] = [], queue = [root]; seen.add(root);
      while (queue.length) {
        const a = queue.pop()!; group.push(a); const ap = a.body.translation();
        for (const b of alive) {
          if (seen.has(b) || b.color !== a.color) continue;
          const bp = b.body.translation(), dx = ap.x - bp.x, dy = ap.y - bp.y, dz = ap.z - bp.z;
          if (dx * dx + dy * dy + dz * dz < 2.65) { seen.add(b); queue.push(b); }
        }
      }
      if (group.length >= 3) out.push(group);
    }
    return out;
  }
}
