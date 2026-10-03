import { MarketObservation, MarketObservationSchema } from '@stupidinu/shared-types';

export class PumpFunMarketAdapter {
  constructor(private readonly staleAfterMs = 60_000) {}

  isConfigured(): boolean {
    return false;
  }

  async fetchTokenMetadata(symbol: string): Promise<Record<string, unknown>> {
    return {
      symbol,
      source: 'pumpfun',
      status: 'simulation-only',
      note: 'Live Pump.fun integration requires verified credentials and endpoint access not present in the local workspace.',
    };
  }

  async fetchMarketObservation(symbol = 'STUPIDINU', pair = 'STUPIDINU/USELESS'): Promise<MarketObservation> {
    const now = Date.now();
    const observation = MarketObservationSchema.parse({
      source: 'pumpfun',
      symbol,
      pair,
      price: '1500000000',
      volume24h: '4200000000',
      marketCap: '6570000000000',
      observedAt: now,
      staleAfterMs: this.staleAfterMs,
      metadata: {
        status: 'simulated',
        source: 'pumpfun',
      },
    });

    return observation;
  }

  async fetchMarketObservations(symbol = 'STUPIDINU'): Promise<MarketObservation[]> {
    return [await this.fetchMarketObservation(symbol)];
  }

  validateObservation(payload: unknown): MarketObservation {
    return MarketObservationSchema.parse(payload);
  }

  assertFresh(observation: MarketObservation): void {
    const ageMs = Date.now() - observation.observedAt;
    if (ageMs > observation.staleAfterMs) {
      throw new Error(`Stale market observation: ${ageMs}ms exceeds ${observation.staleAfterMs}ms threshold.`);
    }
  }
}

export function normalizeMarketEvent(payload: unknown): MarketObservation {
  return MarketObservationSchema.parse(payload);
}
