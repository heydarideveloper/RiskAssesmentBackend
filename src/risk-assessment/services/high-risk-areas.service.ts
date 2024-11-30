import { Injectable } from '@nestjs/common';

export interface HighRiskArea {
  province: string;
  city: string;
  riskLevel: number;
  reason: string;
}

@Injectable()
export class HighRiskAreasService {
  private highRiskAreas: Map<string, HighRiskArea[]> = new Map([
    [
      'West Azerbaijan',
      [
        {
          province: 'West Azerbaijan',
          city: 'Piranshahr',
          riskLevel: 5,
          reason: 'Border city',
        },
        {
          province: 'West Azerbaijan',
          city: 'Sardasht',
          riskLevel: 5,
          reason: 'Border city',
        },
      ],
    ],
    [
      'Sistan and Baluchestan',
      [
        {
          province: 'Sistan and Baluchestan',
          city: 'Saravan',
          riskLevel: 5,
          reason: 'Border city',
        },
        {
          province: 'Sistan and Baluchestan',
          city: 'Khash',
          riskLevel: 5,
          reason: 'Border city',
        },
        {
          province: 'Sistan and Baluchestan',
          city: 'Sarbaz',
          riskLevel: 5,
          reason: 'Border city',
        },
        {
          province: 'Sistan and Baluchestan',
          city: 'Chabahar',
          riskLevel: 5,
          reason: 'Border city',
        },
      ],
    ],
    [
      'Kerman',
      [
        {
          province: 'Kerman',
          city: 'Qasr-e Shirin',
          riskLevel: 5,
          reason: 'Border city',
        },
        {
          province: 'Kerman',
          city: 'Mehran',
          riskLevel: 5,
          reason: 'Border city',
        },
      ],
    ],
    [
      'Hormozgan',
      [
        {
          province: 'Hormozgan',
          city: 'Bandar Lengeh',
          riskLevel: 5,
          reason: 'Border city',
        },
        {
          province: 'Hormozgan',
          city: 'Minab',
          riskLevel: 5,
          reason: 'Border city',
        },
      ],
    ],
  ]);

  isHighRiskArea(province: string, city: string): boolean {
    const provinceAreas = this.highRiskAreas.get(province);
    if (!provinceAreas) return false;
    return provinceAreas.some(
      (area) => area.city.toLowerCase() === city.toLowerCase(),
    );
  }

  getAreaRiskLevel(province: string, city: string): number {
    const provinceAreas = this.highRiskAreas.get(province);
    if (!provinceAreas) return 1;
    const area = provinceAreas.find(
      (area) => area.city.toLowerCase() === city.toLowerCase(),
    );
    return area ? area.riskLevel : 1;
  }

  getAllHighRiskAreas(): HighRiskArea[] {
    return Array.from(this.highRiskAreas.values()).flat();
  }
}
