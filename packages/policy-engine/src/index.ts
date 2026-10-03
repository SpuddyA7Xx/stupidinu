import { PolicyConfig, PolicyConfigSchema, PolicyDecision, PolicyDecisionSchema } from '@stupidinu/shared-types';

export type ActionCandidate = {
  type: string;
  programId?: string;
  size?: number;
  slippageBps?: number;
  amount?: bigint;
  target?: string;
};

export class PolicyEngine {
  constructor(private readonly config: PolicyConfig) {
    PolicyConfigSchema.parse(config);
  }

  evaluateAction(action: ActionCandidate): PolicyDecision {
    const checks: Record<string, boolean> = {};

    if (this.config.emergencyPause) {
      return PolicyDecisionSchema.parse({
        allowed: false,
        reason: 'Emergency pause is active.',
        checks: { emergencyPause: false },
      });
    }

    if (action.type === 'tx' && action.programId) {
      checks.programAllowed = this.config.allowedProgramIds.includes(action.programId);
      if (!checks.programAllowed) {
        return PolicyDecisionSchema.parse({
          allowed: false,
          reason: `Program ${action.programId} is not permitted by policy.`,
          checks,
        });
      }
    }

    if (typeof action.size === 'number') {
      checks.sizeWithinLimit = action.size <= this.config.maxTransactionSize;
      if (!checks.sizeWithinLimit) {
        return PolicyDecisionSchema.parse({
          allowed: false,
          reason: `Transaction size exceeds limit: ${this.config.maxTransactionSize}.`,
          checks,
        });
      }
    }

    if (typeof action.slippageBps === 'number') {
      checks.slippageWithinLimit = action.slippageBps <= this.config.maxSlippageBps;
      if (!checks.slippageWithinLimit) {
        return PolicyDecisionSchema.parse({
          allowed: false,
          reason: `Slippage exceeds configured limit ${this.config.maxSlippageBps} bps.`,
          checks,
        });
      }
    }

    return PolicyDecisionSchema.parse({
      allowed: true,
      reason: 'Policy checks passed.',
      checks: {
        ...checks,
        emergencyPause: true,
      },
    });
  }

  checkBudget(amount: bigint): PolicyDecision {
    const max = BigInt(this.config.maxDailyExpenditure);
    if (amount > max) {
      return PolicyDecisionSchema.parse({
        allowed: false,
        reason: `Requested amount ${amount.toString()} exceeds daily budget ${max.toString()}.`,
        checks: { budgetAllowed: false },
      });
    }

    return PolicyDecisionSchema.parse({
      allowed: true,
      reason: 'Daily budget within limits.',
      checks: { budgetAllowed: true },
    });
  }
}

export function createDefaultPolicyConfig(): PolicyConfig {
  return PolicyConfigSchema.parse({
    allowedProgramIds: ['11111111111111111111111111111111'],
    maxDailyExpenditure: '1000000000',
    maxSlippageBps: 200,
    maxTransactionSize: 1232,
    maxTransactionsPerHour: 12,
    maxModelSpend: '500000000',
    rateLimitPerMinute: 10,
    emergencyPause: false,
    simulationMode: true,
  });
}
