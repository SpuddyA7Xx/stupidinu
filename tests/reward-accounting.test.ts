import { describe, expect, it } from 'vitest';

import {
  RewardDistributor,
  buildRewardAllocations,
  calculateHolderReward,
} from '@stupidinu/reward-accounting';
import { RewardSnapshot } from '@stupidinu/shared-types';

describe('reward accounting', () => {
  it('calculates pro-rata rewards with integer arithmetic', () => {
    expect(calculateHolderReward(1000n, 25n, 100n)).toBe(250n);
    expect(calculateHolderReward(1000n, 33n, 100n)).toBe(330n);
  });

  it('handles zero-supply edge cases deterministically', () => {
    expect(calculateHolderReward(1000n, 30n, 0n)).toBe(0n);
    expect(buildRewardAllocations({
      snapshotId: 'snapshot-zero',
      mint: 'USELESS',
      createdAt: Date.now(),
      slot: 10,
      totalEligibleSupply: 0n,
      eligibleBalances: [{ wallet: 'A', balance: 10n }],
      excludedAccounts: [],
    }, 1000n)).toEqual([]);
  });

  it('builds batched allocations and preserves roundings deterministically', () => {
    const snapshot: RewardSnapshot = {
      snapshotId: 'snapshot-1',
      mint: 'USELESS',
      createdAt: Date.now(),
      slot: 100,
      totalEligibleSupply: 10n,
      eligibleBalances: [
        { wallet: 'A', balance: 6n },
        { wallet: 'B', balance: 4n },
      ],
      excludedAccounts: [],
    };

    const allocations = buildRewardAllocations(snapshot, 10n);
    expect(allocations).toHaveLength(2);
    expect(allocations[0]?.amount).toBe(6n);
    expect(allocations[1]?.amount).toBe(4n);
  });

  it('prevents duplicate claim execution', () => {
    const snapshot: RewardSnapshot = {
      snapshotId: 'snapshot-duplicate',
      mint: 'USELESS',
      createdAt: Date.now(),
      slot: 120,
      totalEligibleSupply: 100n,
      eligibleBalances: [
        { wallet: 'A', balance: 50n },
        { wallet: 'B', balance: 50n },
      ],
      excludedAccounts: [],
    };

    const distributor = new RewardDistributor();
    const first = distributor.claim('A', snapshot, 100n);
    const second = distributor.claim('A', snapshot, 100n);

    expect(first?.amount).toBe(50n);
    expect(second).toBeNull();
  });
});
