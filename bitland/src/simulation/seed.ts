export function canonicalPairKey(a: string, b: string): string {
  return [a.trim().toUpperCase(), b.trim().toUpperCase()].sort().join('::');
}

export function discoverySeed(worldSeed: string, inputA: string, inputB: string, discoveryIndex: number): string {
  if (!Number.isInteger(discoveryIndex) || discoveryIndex < 0) {
    throw new Error('discoveryIndex must be a non-negative integer');
  }

  return `${worldSeed}::${canonicalPairKey(inputA, inputB)}::${discoveryIndex}`;
}
