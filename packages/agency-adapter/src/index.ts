import { HealthStatus, HealthStatusSchema } from '@stupidinu/shared-types';

export class TryAgencyAdapter {
  static isAvailable(): boolean {
    return false;
  }

  static async healthCheck(): Promise<HealthStatus> {
    return HealthStatusSchema.parse({
      ok: false,
      checks: {
        frameworkDetected: false,
        liveConnection: false,
      },
      timestamp: Date.now(),
    });
  }

  static async createAgent(): Promise<never> {
    throw new Error('TryAgency integration is intentionally disabled until the framework is verified and credentials are configured.');
  }
}
