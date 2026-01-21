import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
