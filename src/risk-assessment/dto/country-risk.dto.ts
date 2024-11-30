import { ApiProperty } from '@nestjs/swagger';

export class CountryRiskDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  countryName: string;

  @ApiProperty()
  highRisk: boolean;
}
