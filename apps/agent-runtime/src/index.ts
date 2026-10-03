import { PumpFunMarketAdapter } from '@stupidinu/market-data';
import { PolicyEngine, createDefaultPolicyConfig } from '@stupidinu/policy-engine';
import { MockReasoningProvider } from '@stupidinu/reasoning';
import { Mission, MissionSchema } from '@stupidinu/shared-types';

export class AutonomousAgentRuntime {
  constructor(
    private readonly marketAdapter = new PumpFunMarketAdapter(),
    private readonly reasoner = new MockReasoningProvider(),
    private readonly policyEngine = new PolicyEngine(createDefaultPolicyConfig()),
  ) {}

  async runOnce(): Promise<{ mission: Mission; status: string; policy: unknown }> {
    const observation = await this.marketAdapter.fetchMarketObservation('STUPIDINU');
    const proposal = await this.reasoner.generateProposal({
      symbol: 'STUPIDINU',
      observations: [observation],
      missionCount: 1,
    });

    const mission = MissionSchema.parse({
      id: `mission-${Date.now()}`,
      objective: proposal.missionObjective,
      risk: proposal.risk,
      budget: proposal.budget,
      status: 'OBSERVE',
      observations: [observation],
      actions: proposal.actions,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      maxExecutionMs: 10_000,
      successCriteria: ['Market observation normalized without schema errors.', 'Policy engine confirms approval path.'],
      failureConditions: ['Stale market data', 'Policy engine rejection', 'Budget exhaustion'],
    });

    const policy = this.policyEngine.evaluateAction({
      type: 'tx',
      programId: '11111111111111111111111111111111',
      size: 256,
      slippageBps: 50,
      amount: 10n,
    });

    return {
      mission,
      status: policy.allowed ? 'SIMULATION_OK' : 'POLICY_REJECTED',
      policy,
    };
  }
}

const runtime = new AutonomousAgentRuntime();

runtime.runOnce().then((result) => {
  console.log(JSON.stringify(result, (_key, value) => typeof value === 'bigint' ? value.toString() : value, 2));
}).catch((error: unknown) => {
  console.error('Agent runtime failed:', error);
  process.exitCode = 1;
});
