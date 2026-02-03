import { ApiProperty } from '@nestjs/swagger';
import { CompanyResponseDto } from './company-response.dto';

export class PaginationCompanyResponseDto {
    @ApiProperty({
        example: 1,
        description: 'Total number of pages.',
        format: 'number'
    })
    totalPages: number;
    
    @ApiProperty({
        example: [
            {
                id: '1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
                idNumber: '12345678901',
                name: 'Company name',
                slug: 'company-name',
                webSite: 'https://www.company.com',
                logo: 'https://www.company.com/logo.png',
                isActive: true
            },
        ],
        description: 'List of companies in the current page.',
        type: [ CompanyResponseDto ]
    })
    companies: CompanyResponseDto[];
}