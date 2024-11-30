import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class DocumentUploadDto {
  @ApiProperty()
  @IsString()
  requirementId: string;

  @ApiProperty()
  @IsString()
  documentUrl: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  comments?: string;
}
