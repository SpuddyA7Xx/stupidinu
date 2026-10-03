import { RewardAllocation, RewardDistributionBatch, RewardSnapshot, RewardSnapshotSchema } from '@stupidinu/shared-types';

export function calculateHolderReward(
  distributableRewards: bigint,
  holderBalance: bigint,
  totalEligibleSupply: bigint,
): bigint {
  if (totalEligibleSupply === 0n) {
    return 0n;
  }

  if (holderBalance < 0n) {
    throw new Error('Holder balance cannot be negative.');
  }

  return (distributableRewards * holderBalance) / totalEligibleSupply;
}

export function buildRewardAllocations(
  snapshot: RewardSnapshot,
  distributableRewards: bigint,
): RewardAllocation[] {
  const validated = RewardSnapshotSchema.parse(snapshot);

  if (validated.totalEligibleSupply === 0n || distributableRewards === 0n) {
    return [];
  }

  const ordered = [...validated.eligibleBalances].sort((a, b) => (a.balance > b.balance ? -1 : 1));
  const allocations: RewardAllocation[] = [];
  let sum = 0n;

  for (const entry of ordered) {
    const amount = calculateHolderReward(distributableRewards, entry.balance, validated.totalEligibleSupply);
    sum += amount;
    allocations.push({
      wallet: entry.wallet,
      amount,
      snapshotId: validated.snapshotId,
      status: 'pending',
    });
  }

  const dust = distributableRewards - sum;
  if (dust > 0n && allocations.length > 0) {
    const winner = allocations[0];
    winner.amount += dust;
    winner.status = 'pending';
  }

  return allocations;
}

export class RewardLedger {
  private readonly processed = new Set<string>();

  isProcessed(claimKey: string): boolean {
    return this.processed.has(claimKey);
  }

  markProcessed(claimKey: string): void {
    this.processed.add(claimKey);
  }

  createClaimKey(wallet: string, snapshotId: string): string {
    return `${wallet}:${snapshotId}`;
  }
}

export class RewardDistributor {
  constructor(private readonly ledger = new RewardLedger()) {}

  prepareBatch(snapshot: RewardSnapshot, distributableRewards: bigint): RewardDistributionBatch {
    const allocations = buildRewardAllocations(snapshot, distributableRewards);
    const totalDistributed = allocations.reduce((sum, allocation) => sum + allocation.amount, 0n);

    return {
      batchId: `batch-${snapshot.snapshotId}-${Date.now()}`,
      snapshotId: snapshot.snapshotId,
      allocations,
      totalDistributed,
      generatedAt: Date.now(),
    };
  }

  claim(
    wallet: string,
    snapshot: RewardSnapshot,
    distributableRewards: bigint,
  ): RewardAllocation | null {
    const claimKey = this.ledger.createClaimKey(wallet, snapshot.snapshotId);
    if (this.ledger.isProcessed(claimKey)) {
      return null;
    }

    const matching = buildRewardAllocations(snapshot, distributableRewards).find((allocation) => allocation.wallet === wallet);
    if (!matching) {
      return null;
    }

    this.ledger.markProcessed(claimKey);
    matching.status = 'claimed';
    return matching;
  }
}
