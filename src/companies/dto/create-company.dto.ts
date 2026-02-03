import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    example: '12345678901',
    description: 'The identification number of the company'
  })
  @IsString()
  @MinLength(1)
  @MaxLength(11)
  idNumber: string;

  @ApiProperty({
    example: 'Company name',
    description: 'The name of the company'
  })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  name: string;

  @ApiProperty({
    example: 'Company website',
    description: 'The website of the company',
    nullable: true
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  webSite?: string;
  
  @ApiProperty({
    example: 'Company logo',
    description: 'The logo of the company',
    nullable: true
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  logo?: string;
}
