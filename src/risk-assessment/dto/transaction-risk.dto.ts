import { ApiProperty } from '@nestjs/swagger';

export class TransactionRiskDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  country: string;

  @ApiProperty()
  countryType: string;

  @ApiProperty()
  cityType: string;

  @ApiProperty()
  riskValue: number;
}
