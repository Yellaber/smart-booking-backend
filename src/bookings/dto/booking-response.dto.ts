import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from 'src/common/enums';
import { ServiceBooking } from './service-booking.dto';

export class BookingResponseDto {
    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'The unique identifier of the booking.',
        format: 'uuid'
    })
    id: string;

    @ApiProperty({
        example: '345e6789-c55b-12d3-a678-441114574082',
        description: 'The unique identifier of the user who made the booking.',
        format: 'uuid'
    })
    userId: string;

    @ApiProperty({
        example: '456e7890-e31c-25d6-a891-623314174212',
        description: 'The unique identifier of the specialist for the booking.',
        format: 'uuid'
    })
    specialistId: string;

    @ApiProperty({
        example: [
            {
                name: 'Haircut',
                durationMinutes: 30
            }
        ],
        description: 'The services associated with the booking.',
        type: [ ServiceBooking ]
    })
    services: ServiceBooking[];

    @ApiProperty({
        example: '2026-01-20',
        description: 'The date of the booking (YYYY-MM-DD).',
        format: 'date'
    })
    date: string;

    @ApiProperty({
        example: '09:00',
        description: 'The start time of the booking (HH:mm).',
        format: 'time'
    })
    startTime: string;

    @ApiProperty({
        example: '09:30',
        description: 'The end time of the booking (HH:mm).',
        format: 'time'
    })
    endTime: string;

    @ApiProperty({
        example: 'confirmed',
        description: 'The status of the booking.',
        enum: AppointmentStatus
    })
    status: AppointmentStatus;
}