import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class PaginationUserResponseDto {
    @ApiProperty({
        example: 1,
        description: 'Total number of users.',
        format: 'number'
    })
    total: number;

    @ApiProperty({
        example: [
            {
                id: '1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
                idType: 'CC',
                idNumber: '1234567890',
                fullName: 'john doe',
                userName: 'john-doe',
                address: 'cra 8 # 14-25',
                email: 'johndoe@gmail.com',
                phone: null,
                city: 'cartagena',
                image: null,
                roles: ['customer', 'specialist'],
            },
        ],
        type: [ UserResponseDto ],
        description: 'List of users in the current page.'
    })
    users: UserResponseDto[];
}