import { ApiProperty } from '@nestjs/swagger';

export class CompanyResponseDto {
    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
        description: 'Unique identifier for the company in UUID format',
        format: 'uuid'
    })
    id: string;

    @ApiProperty({
        example: '12345678901',
        description: 'The identification number of the company',
        format: 'string'
    })
    idNumber: string;
    
    @ApiProperty({
        example: 'company name',
        description: 'The name of the company',
        format: 'string'
    })
    name: string;

    @ApiProperty({
        example: 'company-name',
        description: 'The slug of the company',
        format: 'string'
    })
    slug: string;
    
    @ApiProperty({
        example: 'www.company.com',
        description: 'The website of the company',
        format: 'string',
        required: false
    })
    webSite?: string;
      
    @ApiProperty({
        example: 'https://www.company.com/logo.png',
        description: 'The logo of the company',
        format: 'string',
        required: false
    })
    logo?: string;
}