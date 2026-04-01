import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiProperty({
    example: true,
    description: 'The status of the company',
    format: 'boolean',
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
