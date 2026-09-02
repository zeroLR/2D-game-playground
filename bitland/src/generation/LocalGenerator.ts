import type { SemanticGenerationContext, SemanticGenerator, SemanticProposal } from './SemanticGenerator';

const NAME_PARTS = ['Node', 'Shard', 'Core', 'Relay', 'Bloom', 'Prism', 'Shell', 'Beacon'];
const DESCRIPTORS = [
  'A stable primitive assembled from observed world laws.',
  'A compact structure whose behavior follows canonical trait rules.',
  'A bounded artifact produced by deterministic synthesis semantics.',
  'A geometric construct that reflects the current discovery vocabulary.',
];

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export class LocalSemanticGenerator implements SemanticGenerator {
  readonly id = 'local-deterministic';

  async generate(context: SemanticGenerationContext): Promise<SemanticProposal> {
    const hash = hashSeed(`${context.worldSeed}::semantic::${context.canonicalId}`);
    const [a, b] = [...context.inputs].sort();
    return {
      displayName: `${a.slice(0, 3)}-${b.slice(0, 3)} ${NAME_PARTS[hash % NAME_PARTS.length]}`,
      description: DESCRIPTORS[(hash >>> 5) % DESCRIPTORS.length],
      proposedTraits: [...context.canonicalTraits],
    };
  }
}
