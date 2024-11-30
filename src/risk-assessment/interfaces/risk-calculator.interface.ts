import { CustomerDto } from '../dto/customer.dto';

export interface RiskCalculator {
  calculateRisk(customer: CustomerDto): number;
  getWeightage(): number;
}
