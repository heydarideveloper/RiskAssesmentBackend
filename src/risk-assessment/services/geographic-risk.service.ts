import { Injectable } from '@nestjs/common';
import { CustomerDto } from '../dto/customer.dto';
import { RiskCalculator } from '../interfaces/risk-calculator.interface';

@Injectable()
export class GeographicRiskService implements RiskCalculator {
  private readonly highRiskCountries = [
    'Afghanistan',
    'Algeria',
    'Argentina',
    'Bahamas',
    'Bangladesh',
    'Ecuador',
    'Iran',
    'Iraq',
    'North Korea',
    'Pakistan',
    'Syria',
    'Yemen',
  ];

  private readonly mediumRiskCountries = [
    'China',
    'Russia',
    'Turkey',
    'UAE',
    'Lebanon',
    'Egypt',
  ];

  private readonly highRiskBorderCities = [
    'Zahedan',
    'Zabol',
    'Mirjaveh',
    'Saravan', // Iran-Pakistan border
    'Taybad',
    'Dogharoon', // Iran-Afghanistan border
    'Baneh',
    'Marivan',
    'Piranshahr', // Iran-Iraq border
  ];

  private readonly highRiskProvinces = [
    'Sistan and Baluchestan',
    'Kurdistan',
    'West Azerbaijan',
  ];

  calculateRisk(customer: CustomerDto): number {
    let riskScore = 0;

    // Country risk assessment with more granular scoring
    if (this.highRiskCountries.includes(customer.nationality)) {
      riskScore += 5;
    } else if (this.mediumRiskCountries.includes(customer.nationality)) {
      riskScore += 3;
    } else if (customer.nationality !== 'Iran') {
      riskScore += 2;
    }

    // Province risk assessment
    const customerProvince = this.extractProvince(customer.birthPlace);
    if (this.highRiskProvinces.includes(customerProvince)) {
      riskScore += 2;
    }

    // Border city risk assessment
    if (this.highRiskBorderCities.includes(customer.birthPlace)) {
      riskScore += 3;
    }

    // Residence change risk
    if (customer.legalResidence !== customer.birthPlace) {
      if (this.highRiskBorderCities.includes(customer.legalResidence)) {
        riskScore += 3;
      } else if (
        this.extractProvince(customer.legalResidence) !== customerProvince
      ) {
        riskScore += 1;
      }
    }

    // Multiple location risk
    if (this.hasMultipleLocations(customer)) {
      riskScore += 1;
    }

    return Math.min(Math.max(Math.round(riskScore / 3), 1), 5);
  }

  getWeightage(): number {
    return 0.25;
  }

  private extractProvince(location: string): string {
    // Mock implementation - in real system, would use a location database
    return location.split(',')[0].trim();
  }

  private hasMultipleLocations(customer: CustomerDto): boolean {
    const locations = new Set([
      customer.birthPlace,
      customer.legalResidence,
      // Could add more location fields if available
    ]);
    return locations.size > 1;
  }

  getAreaRiskLevel(province: string, city: string): number {
    if (this.isHighRiskArea(province, city)) {
      return 5;
    }
    return 1;
  }

  private isHighRiskArea(province: string, city: string): boolean {
    // Implement your logic to determine if a province and city are high-risk
    return false;
  }
}
