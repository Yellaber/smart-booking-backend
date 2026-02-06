import { ApiProperty } from '@nestjs/swagger';

export class SpecialtyResponseDto {
    @ApiProperty({
        example: 'b3a1c5d2-8f4e-4c6d-9e2f-1a2b3c4d5e6f',
        description: 'UUID of the specialty.',
        format: 'uuid',
    })
    id: string;

    @ApiProperty({
        example: 'Specialty name',
        description: 'The name of the specialty.',
        format: 'string',
    })
    name: string;

    @ApiProperty({
        example: 'This is a description about the specialty.',
        description: 'The description of the specialty.',
        format: 'string',
        required: false
    })
    description?: string;
}