import { describe, expect, it } from 'vitest';

import { PolicyEngine, createDefaultPolicyConfig } from '@stupidinu/policy-engine';

describe('policy engine', () => {
  it('accepts allowed actions and rejects unauthorized program invocations', () => {
    const engine = new PolicyEngine({
      ...createDefaultPolicyConfig(),
      allowedProgramIds: ['system'],
    });

    const allowed = engine.evaluateAction({
      type: 'tx',
      programId: 'system',
      size: 256,
      slippageBps: 50,
      amount: 5n,
    });

    const rejected = engine.evaluateAction({
      type: 'tx',
      programId: 'evil',
      size: 256,
      slippageBps: 50,
      amount: 5n,
    });

    expect(allowed.allowed).toBe(true);
    expect(rejected.allowed).toBe(false);
    expect(rejected.reason).toContain('not permitted');
  });

  it('enforces emergency pause semantics', () => {
    const engine = new PolicyEngine({
      ...createDefaultPolicyConfig(),
      emergencyPause: true,
    });

    const outcome = engine.evaluateAction({
      type: 'tx',
      programId: 'system',
      size: 128,
      slippageBps: 10,
      amount: 10n,
    });

    expect(outcome.allowed).toBe(false);
    expect(outcome.reason).toContain('Emergency pause');
  });
});
