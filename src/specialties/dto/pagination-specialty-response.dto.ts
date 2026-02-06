import { ApiProperty } from '@nestjs/swagger';
import { SpecialtyResponseDto } from './specialty-response.dto';

export class PaginationSpecialtyResponseDto {
    @ApiProperty({
        example: 1,
        description: 'The total number of pages.',
        format: 'number'
    })
    totalPages: number;

    @ApiProperty({
        example: [
            {
                id: 'b3a1c5d2-8f4e-4c6d-9e2f-1a2b3c4d5e6f',
                name: 'Specialty name',
                description: 'This is a description about the specialty.',
            }
        ],
        type: [ SpecialtyResponseDto ],
        description: 'list of specialties.',
        format: 'array'
    })
    specialties: SpecialtyResponseDto[];
}