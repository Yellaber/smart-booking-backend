import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    example: '12345678901',
    description: 'The identification number of the company',
    format: 'string'
  })
  @IsString()
  @MinLength(1)
  @MaxLength(11)
  idNumber: string = '';

  @ApiProperty({
    example: 'Company name',
    description: 'The name of the company',
    format: 'string'
  })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  name: string = '';

  @ApiProperty({
    example: 'www.company.com',
    description: 'The website of the company',
    format: 'string',
    required: false
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  webSite?: string;
  
  @ApiProperty({
    example: 'https://www.company.com/logo.png',
    description: 'The logo of the company',
    format: 'string',
    required: false
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  logo?: string;

  @ApiProperty({
    example: [ '123e4567-e89b-12d3-a456-426614174000' ],
    description: 'IDs of the subcategories related with the company',
    format: 'uuid',
    isArray: true
  })
  @IsUUID('all', { each: true })
  subCategoriesIds: string[] = [];
}
