import type { Trait } from '../simulation/synthesis/synthesis';
import type { SemanticProposal } from './SemanticGenerator';

const TRAITS: Trait[] = ['HEAVY', 'LIGHTWEIGHT', 'HOT', 'REFLECTIVE', 'ORGANIC', 'PULSING', 'CONDUCTIVE', 'UNSTABLE'];
const TRAIT_SET = new Set<string>(TRAITS);

export type ValidSemanticProposal = {
  displayName: string;
  description: string;
  proposedTraits: Trait[];
};

export function validateSemanticProposal(proposal: SemanticProposal): ValidSemanticProposal | null {
  const displayName = proposal.displayName.trim();
  const description = proposal.description.trim();
  if (displayName.length < 3 || displayName.length > 48) return null;
  if (description.length < 8 || description.length > 180) return null;

  const proposedTraits = [...new Set(proposal.proposedTraits.filter((trait): trait is Trait => TRAIT_SET.has(trait)))];
  if (proposedTraits.length === 0 || proposedTraits.length > 3) return null;

  return { displayName, description, proposedTraits };
}
