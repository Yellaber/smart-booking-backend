import { ApiProperty } from '@nestjs/swagger';
import { CompanyResponseDto } from './company-response.dto';

export class PaginationCompanyResponseDto {
    @ApiProperty({
        example: 1,
        description: 'Total number of companies.',
        format: 'number'
    })
    total: number = 0;
    
    @ApiProperty({
        example: [
            {
                id: '1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
                idNumber: '12345678901',
                name: 'company name',
                slug: 'company-name',
                webSite: 'https://www.company.com',
                logo: 'https://www.company.com/logo.png',
                subCategories: [ 'barber shop', 'hair salon', 'tatoo shop' ]
            },
        ],
        type: [ CompanyResponseDto ],
        description: 'List of companies in the current page.'
    })
    companies: CompanyResponseDto[] = [];
}