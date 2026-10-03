import { describe, expect, it } from 'vitest';

import { PumpFunMarketAdapter } from '@stupidinu/market-data';

describe('market data adapter', () => {
  it('normalizes market observations and validates schema constraints', async () => {
    const adapter = new PumpFunMarketAdapter();
    const payload = await adapter.fetchMarketObservation('STUPIDINU');

    expect(payload.symbol).toBe('STUPIDINU');
    expect(payload.source).toBe('pumpfun');
  });

  it('rejects malformed payloads', () => {
    const adapter = new PumpFunMarketAdapter();
    expect(() => adapter.validateObservation({
      source: 'pumpfun',
      symbol: '',
      observedAt: Date.now(),
      staleAfterMs: 1000,
    })).toThrow();
  });

  it('rejects stale observations', () => {
    const adapter = new PumpFunMarketAdapter(1_000);

    expect(() => adapter.assertFresh({
      source: 'simulated',
      symbol: 'STUPIDINU',
      observedAt: Date.now() - 2_000,
      staleAfterMs: 1_000,
      metadata: {},
    })).toThrow(/Stale market observation/);
  });
});
