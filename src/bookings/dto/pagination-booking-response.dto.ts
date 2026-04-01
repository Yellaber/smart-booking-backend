import { ApiProperty } from '@nestjs/swagger';
import { BookingResponseDto } from './booking-response.dto';

export class PaginationBookingResponseDto {
    @ApiProperty({
        example: 1,
        description: 'Total number of bookings',
        format: 'number'
    })
    total: number;

    @ApiProperty({
        example: [
            {
                id: '1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
                userId: '345e6789-c55b-12d3-a678-441114574082',
                specialistId: '456e7890-e31c-25d6-a891-623314174212',
                services: [
                    {
                        name: 'Haircut',
                        durationMinutes: 30
                    }
                ],
                date: '2026-01-15',
                startTime: '09:00',
                endTime: '09:30',
                status: 'confirmed'
            }
        ],
        type: [ BookingResponseDto ],
        description: 'List of bookings in the current page.',
    })
    bookings: BookingResponseDto[];
}