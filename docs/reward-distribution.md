# Reward Distribution

The reward accounting implementation supports bounded planning and claim prevention. Distribution is modeled as a batch process whose allocations are computed from a consistent snapshot and checked for duplicates.

## Modes

- Claim-based mode: a claimant can verify their eligible amount from a snapshot.
- Batch mode: the runtime creates an allocation ledger for each snapshot.

This repository currently implements the batch-style planner and duplicate check logic in simulation mode.
