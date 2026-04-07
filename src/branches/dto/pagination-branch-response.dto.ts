import { ApiProperty } from '@nestjs/swagger';
import { BranchResponseDto } from './branch-response.dto';

export class PaginationBranchResponseDto {
    @ApiProperty({
        example: 1,
        description: 'Total number of branches',
        format: 'number'
    })
    total: number;

    @ApiProperty({
        example: [
            {
                id: '1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
                name: 'Branch name',
                slug: 'branch-name',
                address: 'Cra 123 #45-67',
                city: 'cartagena',
                country: 'CO',
                phone: '1234567890',
                email: 'branchname@company.com'
            }
        ],
        type: [ BranchResponseDto ],
        description: 'List of branches in the current page.',
    })
    branches: BranchResponseDto[];
}