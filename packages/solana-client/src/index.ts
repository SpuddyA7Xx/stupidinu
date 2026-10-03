export type SimulationResult = {
  ok: boolean;
  logs: string[];
  error?: string;
};

export class SolanaClient {
  constructor(private readonly rpcUrl = process.env.SOLANA_RPC_URL ?? 'http://127.0.0.1:8899') {}

  isConfigured(): boolean {
    return false;
  }

  async simulateTransaction(_payload: Record<string, unknown>): Promise<SimulationResult> {
    return {
      ok: true,
      logs: ['Simulation is disabled by default; this is a local safety-first harness.'],
    };
  }

  async sendTransaction(_payload: Record<string, unknown>): Promise<never> {
    throw new Error('Onchain sending is disabled by default. Configure a verified Solana environment before enabling transactions.');
  }
}
