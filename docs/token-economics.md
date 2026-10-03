# Token Economics

The token economy is intentionally conservative: the project models reward distribution using deterministic formulas, bounded budgets, and snapshot verification. It does not claim speculative price appreciation or guaranteed token value.

## Reward formula

The formula used by the implementation is:

$$
holder\_reward = distributable\_rewards \times eligible\_holder\_balance / total\_eligible\_supply
$$

The code uses bigint arithmetic and avoids floating-point movement of token-denominated balances.
