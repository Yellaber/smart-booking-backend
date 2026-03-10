import { ApiProperty } from '@nestjs/swagger';

export class ServiceResponseDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Unique identifier of the service.',
        format: 'uuid',
    })
    id: string;

    @ApiProperty({
        example: 'Haircut',
        description: 'Name of the service.',
        format: 'string'
    })
    name: string;

    @ApiProperty({
        example: 30,
        description: 'Duration of the service in minutes.',
        format: 'number'
    })
    durationMinutes: number;

    @ApiProperty({
        example: 21000.00,
        description: 'Price of the service.',
        format: 'number'
    })
    price: number;
}