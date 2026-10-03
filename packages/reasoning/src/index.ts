import { ReasoningProposal, ReasoningProposalSchema } from '@stupidinu/shared-types';

export interface ReasoningContext {
  symbol: string;
  observations: Array<{ source: string; symbol: string; price?: string; volume24h?: string }>;
  missionCount: number;
}

export interface ReasoningProvider {
  generateProposal(context: ReasoningContext): Promise<ReasoningProposal>;
}

export class MockReasoningProvider implements ReasoningProvider {
  async generateProposal(context: ReasoningContext): Promise<ReasoningProposal> {
    const proposal = ReasoningProposalSchema.parse({
      missionObjective: `Observe ${context.symbol} and publish a low-risk mission for reward monitoring.`,
      rationale: [
        'The market signal is read-only and bounded to simulation mode.',
        'The objective prioritizes data quality and reward accounting integrity.',
        'The agent remains noncustodial and avoids unverified onchain actions.',
      ],
      risk: 'LOW',
      budget: Math.min(50, context.missionCount * 10 + 20),
      actions: [
        {
          type: 'observe',
          target: 'pumpfun.market',
          params: { symbol: context.symbol, scope: 'simulated' },
        },
        {
          type: 'audit',
          target: 'reward.snapshot',
          params: { check: 'snapshot-consistency' },
        },
      ],
    });

    return proposal;
  }
}
