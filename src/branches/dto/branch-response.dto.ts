import { ApiProperty } from '@nestjs/swagger';

export class BranchResponseDto {
    @ApiProperty({
        example: 'b3a1c5d2-8f4e-4c6d-9e2f-1a2b3c4d5e6f',
        description: 'UUID of the branch',
        format: 'uuid',
    })
    id: string;

    @ApiProperty({
        example: 'Main branch',
        description: 'The name of the branch.',
        format: 'string',
    })
    name: string;

    @ApiProperty({
        example: 'main-branch',
        description: 'Slug of the branch.',
        format: 'string',
    })
    slug: string;
    
    @ApiProperty({
        example: 'Cra 8 # 14-25',
        description: 'Address of the branch.',
        format: 'string'
    })
    address: string;
    
    @ApiProperty({
        example: 'cartagena',
        description: 'City where the branch is located.',
        format: 'string',
    })
    city: string;
    
    @ApiProperty({
        example: 'branchname@gmail.com',
        description: 'Email address of the branch.',
        format: 'string',
        required: false
    })
    email?: string;

    @ApiProperty({
        example: '1234567890',
        description: 'Phone number of the branch.',
        format: 'string',
        required: false
    })
    phone?: string;
}