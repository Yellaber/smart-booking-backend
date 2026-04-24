import { ApiProperty } from '@nestjs/swagger';

export class ServiceBooking {
    @ApiProperty({
        example: 'Haircut',
        description: 'The name of the service.',
        format: 'string'
    })
    name: string = '';

    @ApiProperty({
        example: 30,
        description: 'The duration of the service in minutes.',
        format: 'number'
    })
    durationMinutes: number = 0;
}