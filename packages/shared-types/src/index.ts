import { z } from 'zod';

export const AddressSchema = z.string().min(32).max(44);
export const BigIntStringSchema = z.string().regex(/^\d+$/);

export const MarketObservationSchema = z.object({
  source: z.enum(['pumpfun', 'solana', 'simulated']),
  symbol: z.string().min(1).max(16),
  pair: z.string().min(1).max(32).optional(),
  price: BigIntStringSchema.optional(),
  volume24h: BigIntStringSchema.optional(),
  marketCap: BigIntStringSchema.optional(),
  observedAt: z.number().int().nonnegative(),
  staleAfterMs: z.number().int().nonnegative(),
  metadata: z.record(z.unknown()).default({}),
});

export type MarketObservation = z.infer<typeof MarketObservationSchema>;

export const PolicyConfigSchema = z.object({
  allowedProgramIds: z.array(z.string()).default([]),
  maxDailyExpenditure: BigIntStringSchema,
  maxSlippageBps: z.number().int().nonnegative().max(10000),
  maxTransactionSize: z.number().int().positive(),
  maxTransactionsPerHour: z.number().int().nonnegative(),
  maxModelSpend: BigIntStringSchema,
  rateLimitPerMinute: z.number().int().nonnegative(),
  emergencyPause: z.boolean().default(false),
  simulationMode: z.boolean().default(true),
});

export type PolicyConfig = z.infer<typeof PolicyConfigSchema>;

export const PolicyDecisionSchema = z.object({
  allowed: z.boolean(),
  reason: z.string().optional(),
  checks: z.record(z.boolean()).default({}),
});

export type PolicyDecision = z.infer<typeof PolicyDecisionSchema>;

export const RewardSnapshotSchema = z.object({
  snapshotId: z.string(),
  mint: z.string(),
  createdAt: z.number().int().nonnegative(),
  slot: z.number().int().nonnegative(),
  totalEligibleSupply: z.bigint(),
  eligibleBalances: z.array(
    z.object({
      wallet: z.string(),
      balance: z.bigint(),
    }),
  ),
  excludedAccounts: z.array(z.string()).default([]),
});

export type RewardSnapshot = z.infer<typeof RewardSnapshotSchema>;

export const RewardAllocationSchema = z.object({
  wallet: z.string(),
  amount: z.bigint(),
  snapshotId: z.string(),
  status: z.enum(['pending', 'claimed', 'distributed', 'rejected']),
});

export type RewardAllocation = z.infer<typeof RewardAllocationSchema>;

export const RewardDistributionBatchSchema = z.object({
  batchId: z.string(),
  snapshotId: z.string(),
  allocations: z.array(RewardAllocationSchema),
  totalDistributed: z.bigint(),
  generatedAt: z.number().int().nonnegative(),
});

export type RewardDistributionBatch = z.infer<typeof RewardDistributionBatchSchema>;

export const MissionSchema = z.object({
  id: z.string(),
  objective: z.string(),
  risk: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  budget: z.number().int().nonnegative(),
  status: z.enum(['OBSERVE', 'PROPOSE', 'VALIDATE', 'EXECUTE', 'VERIFY', 'LEARN', 'REJECTED', 'FAILED']),
  observations: z.array(MarketObservationSchema),
  actions: z.array(z.object({
    type: z.string(),
    target: z.string(),
    params: z.record(z.unknown()),
  })).default([]),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
  maxExecutionMs: z.number().int().positive(),
  successCriteria: z.array(z.string()).default([]),
  failureConditions: z.array(z.string()).default([]),
});

export type Mission = z.infer<typeof MissionSchema>;

export const AgentTaskSchema = z.object({
  name: z.string(),
  scheduledAt: z.number().int().nonnegative(),
  retries: z.number().int().nonnegative(),
  idempotencyKey: z.string(),
  payload: z.record(z.unknown()),
});

export type AgentTask = z.infer<typeof AgentTaskSchema>;

export const ReasoningProposalSchema = z.object({
  missionObjective: z.string(),
  rationale: z.array(z.string()),
  risk: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  budget: z.number().int().nonnegative(),
  actions: z.array(z.object({
    type: z.string(),
    target: z.string(),
    params: z.record(z.unknown()),
  })),
});

export type ReasoningProposal = z.infer<typeof ReasoningProposalSchema>;

export const HealthStatusSchema = z.object({
  ok: z.boolean(),
  checks: z.record(z.boolean()),
  timestamp: z.number().int().nonnegative(),
});

export type HealthStatus = z.infer<typeof HealthStatusSchema>;

export function parseBigInt(value: string): bigint {
  if (!/^\d+$/.test(value)) {
    throw new Error(`Invalid integer string: ${value}`);
  }

  return BigInt(value);
}
