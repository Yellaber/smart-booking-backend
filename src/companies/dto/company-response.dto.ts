import { ApiProperty } from '@nestjs/swagger';

export class CompanyResponseDto {
    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
        description: 'Unique identifier for the company in UUID format.',
        uniqueItems: true,
        format: 'uuid'
    })
    id: string;

    @ApiProperty({
        example: '12345678901',
        description: 'The identification number of the company'
    })
    idNumber: string;
    
    @ApiProperty({
        example: 'Company name',
        description: 'The name of the company'
    })
    name: string;
    
    @ApiProperty({
        example: 'Company website',
        description: 'The website of the company',
        nullable: true
    })
    webSite?: string;
      
    @ApiProperty({
        example: 'Company logo',
        description: 'The logo of the company',
        nullable: true
    })
    logo?: string;

    @ApiProperty({
        example: true,
        description: 'Indicates whether the company is active or not.',
        format: 'boolean',
        default: true
    })
    isActive: boolean;
}