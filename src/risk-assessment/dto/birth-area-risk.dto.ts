import { ApiProperty } from '@nestjs/swagger';

export class BirthAreaRiskDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  country: string;

  @ApiProperty()
  province: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  highRisk: boolean;
}
