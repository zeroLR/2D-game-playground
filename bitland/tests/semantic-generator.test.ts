import { describe, expect, it } from 'vitest';
import { LocalSemanticGenerator } from '../src/generation/LocalGenerator';
import { validateSemanticProposal } from '../src/generation/RuleValidator';
import { generateSemantic } from '../src/generation/generateSemantic';
import type { SemanticGenerationContext, SemanticGenerator } from '../src/generation/SemanticGenerator';

const context: SemanticGenerationContext = {
  canonicalId: 'world::MATTER::LIFE::0',
  worldSeed: 'world',
  inputs: ['MATTER', 'LIFE'],
  canonicalTraits: ['ORGANIC', 'HEAVY'],
  discoveryIndex: 0,
};

describe('semantic generator adapter', () => {
  it('uses a valid primary semantic provider', async () => {
    const primary: SemanticGenerator = {
      id: 'mock-ai',
      async generate() {
        return { displayName: 'Living Anchor', description: 'A dense organic relay shaped by the observed inputs.', proposedTraits: ['ORGANIC', 'HEAVY'] };
      },
    };
    const result = await generateSemantic(context, primary);
    expect(result.providerId).toBe('mock-ai');
    expect(result.usedFallback).toBe(false);
  });

  it('rejects proposals that contain no supported traits', () => {
    expect(validateSemanticProposal({ displayName: 'Void Form', description: 'An unsupported semantic proposal.', proposedTraits: ['TELEPORT', 'GODMODE'] })).toBeNull();
  });

  it('falls back when the primary provider returns invalid output', async () => {
    const primary: SemanticGenerator = {
      id: 'invalid-ai',
      async generate() {
        return { displayName: 'X', description: 'bad', proposedTraits: ['GODMODE'] };
      },
    };
    const result = await generateSemantic(context, primary);
    expect(result.providerId).toBe('local-deterministic');
    expect(result.usedFallback).toBe(true);
  });

  it('falls back on timeout and remains deterministic', async () => {
    const primary: SemanticGenerator = {
      id: 'slow-ai',
      async generate() {
        return new Promise(() => undefined);
      },
    };
    const a = await generateSemantic(context, primary, 1);
    const b = await generateSemantic(context, primary, 1);
    expect(a.usedFallback).toBe(true);
    expect(a.value).toEqual(b.value);
  });

  it('local generator is deterministic for canonical context', async () => {
    const local = new LocalSemanticGenerator();
    expect(await local.generate(context)).toEqual(await local.generate(context));
  });
});
