import { ApiProperty } from '@nestjs/swagger';
import { SpecialistResponseDto } from './specialist-response.dto';

export class PaginationSpecialistResponseDto {
    @ApiProperty({
        example: 1,
        description: 'Total number of specialists.',
        format: 'number'
    })
    total: number;

    @ApiProperty({
        example: [
            {
                id: '1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5d6',
                specialist: {
                    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
                    fullName: 'john doe',
                    image: 'https://www.company.com/users/john-doe.png'
                },
                isAvailable: true
            },
        ],
        type: [ SpecialistResponseDto ],
        description: 'List of specialists in the current page.'
    })
    specialists: SpecialistResponseDto[];
}