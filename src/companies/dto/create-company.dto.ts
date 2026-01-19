import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(11)
  idNumber: string;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  webSite?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  logo?: string;
}
