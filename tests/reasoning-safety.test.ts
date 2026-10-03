import { describe, expect, it } from 'vitest';

import { MockReasoningProvider } from '@stupidinu/reasoning';
import { MissionSchema } from '@stupidinu/shared-types';

describe('reasoning and mission safety', () => {
  it('creates structured proposals that validate against the schema', async () => {
    const provider = new MockReasoningProvider();
    const proposal = await provider.generateProposal({
      symbol: 'STUPIDINU',
      observations: [{ source: 'pumpfun', symbol: 'STUPIDINU', price: '1' }],
      missionCount: 1,
    });

    expect(proposal.missionObjective.length).toBeGreaterThan(0);
    expect(proposal.actions.length).toBeGreaterThan(0);
    expect(() => MissionSchema.parse({
      id: 'mission-1',
      objective: proposal.missionObjective,
      risk: proposal.risk,
      budget: proposal.budget,
      status: 'OBSERVE',
      observations: [],
      actions: proposal.actions,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      maxExecutionMs: 10_000,
      successCriteria: ['ok'],
      failureConditions: ['fail'],
    })).not.toThrow();
  });

  it('supports recovery of a persisted mission state', () => {
    const mission = MissionSchema.parse({
      id: 'recovery-1',
      objective: 'Recover after restart',
      risk: 'MEDIUM',
      budget: 50,
      status: 'VERIFY',
      observations: [],
      actions: [{ type: 'observe', target: 'pumpfun', params: { symbol: 'STUPIDINU' } }],
      createdAt: 1,
      updatedAt: 2,
      maxExecutionMs: 10_000,
      successCriteria: ['mission recovered'],
      failureConditions: ['loss of state'],
    });

    expect(mission.status).toBe('VERIFY');
    expect(mission.actions[0]?.type).toBe('observe');
  });
});
