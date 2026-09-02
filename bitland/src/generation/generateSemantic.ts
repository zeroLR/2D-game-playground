import { LocalSemanticGenerator } from './LocalGenerator';
import { validateSemanticProposal, type ValidSemanticProposal } from './RuleValidator';
import type { SemanticGenerationContext, SemanticGenerator } from './SemanticGenerator';

export type SemanticGenerationResult = {
  providerId: string;
  usedFallback: boolean;
  value: ValidSemanticProposal;
};

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('semantic generation timeout')), timeoutMs)),
  ]);
}

export async function generateSemantic(
  context: SemanticGenerationContext,
  primary: SemanticGenerator,
  timeoutMs = 1200,
  fallback: SemanticGenerator = new LocalSemanticGenerator(),
): Promise<SemanticGenerationResult> {
  try {
    const proposal = await withTimeout(primary.generate(context), timeoutMs);
    const valid = validateSemanticProposal(proposal);
    if (valid) return { providerId: primary.id, usedFallback: false, value: valid };
  } catch {
    // External semantic generation is optional. Deterministic fallback owns availability.
  }

  const fallbackProposal = await fallback.generate(context);
  const validFallback = validateSemanticProposal(fallbackProposal);
  if (!validFallback) throw new Error('Local semantic fallback produced invalid output');
  return { providerId: fallback.id, usedFallback: true, value: validFallback };
}
