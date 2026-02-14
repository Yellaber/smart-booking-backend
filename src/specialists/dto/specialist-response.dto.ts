import { ApiProperty } from '@nestjs/swagger';
import { DataUserResponseDto } from './data-user-response.dto';

export class SpecialistResponseDto {
    @ApiProperty({
        example: '1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
        description: 'Specialist id.',
        format: 'uuid'
    })
    id: string;

    @ApiProperty({
        example: {
            id: 't1g2c3d4-e5f6-7g8h-9i0j-k3l2x3n4o5p6',
            fullName: 'john doe',
            image: 'https://www.company.com/users/john-doe.png'
        },
        type: DataUserResponseDto,
        description: 'User data.'
    })
    user: DataUserResponseDto;

    @ApiProperty({
        example: true,
        description: 'Specialist availability.'
    })
    isAvailable: boolean;
}