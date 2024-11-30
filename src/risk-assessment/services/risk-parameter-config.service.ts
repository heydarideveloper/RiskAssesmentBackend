import { Injectable } from '@nestjs/common';

@Injectable()
export class RiskParameterConfigService {
  getThresholds() {
    return {
      high: 1000000,
      medium: 500000,
      low: 100000,
    };
  }

  getRiskWeights() {
    return {
      geographic: 0.3,
      relationship: 0.2,
      activity: 0.2,
      financial: 0.15,
      transaction: 0.15,
    };
  }
}
