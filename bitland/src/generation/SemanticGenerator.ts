import type { Trait } from '../simulation/synthesis/synthesis';
import type { RootResource } from '../simulation/world/resources';

export type SemanticGenerationContext = {
  canonicalId: string;
  worldSeed: string;
  inputs: [RootResource, RootResource];
  canonicalTraits: Trait[];
  discoveryIndex: number;
};

export type SemanticProposal = {
  displayName: string;
  description: string;
  proposedTraits: string[];
};

export type SemanticGenerator = {
  id: string;
  generate(context: SemanticGenerationContext): Promise<SemanticProposal>;
};
