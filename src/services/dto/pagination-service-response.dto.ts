import { ApiProperty } from '@nestjs/swagger';
import { ServiceResponseDto } from './service-response.dto';

export class PaginationServiceResponseDto {
    @ApiProperty({
        example: 1,
        description: 'Total number of services.',
        format: 'number'
    })
    total: number = 0;

    @ApiProperty({
        example: [
            {
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'Haircut',
                durationMinutes: 60,
                price: 21000.00
            }
        ],
        type: [ ServiceResponseDto ],
        description: 'List of services in the current page.',
    })
    services: ServiceResponseDto[] = [];
}