import { ApiProperty } from '@nestjs/swagger';
import { DataUserResponseDto } from './data-user-response.dto';

export class SpecialistResponseDto {
    @ApiProperty({
        example: '1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5d6',
        description: 'Specialist id.',
        format: 'uuid'
    })
    id: string;

    @ApiProperty({
        example: {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
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