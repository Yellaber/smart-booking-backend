import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../../common/enums';
import { ServiceBooking } from './service-booking.dto';
import { TypeAppointment } from '../../common/enums/type-appointment.enum';

export class BookingResponseDto {
    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        description: 'The unique identifier of the booking.',
        format: 'uuid'
    })
    id: string = '';

    @ApiProperty({
        example: 'Downtown Branch',
        description: 'The branch where the booking is made.',
        format: 'string'
    })
    branch: string = '';

    @ApiProperty({
        example: 'john doe',
        description: 'The name of the user who made the booking.',
        format: 'string'
    })
    user: string = '';

    @ApiProperty({
        example: 'jane smith',
        description: 'The name of the specialist for the booking.',
        format: 'string'
    })
    specialist: string = '';

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
    services: ServiceBooking[] = [];

    @ApiProperty({
        example: '2026-01-20',
        description: 'The date of the booking (YYYY-MM-DD).',
        format: 'date'
    })
    date: string = '';

    @ApiProperty({
        example: '09:00',
        description: 'The start time of the booking (HH:mm).',
        format: 'time'
    })
    startTime: string = '';

    @ApiProperty({
        example: '09:30',
        description: 'The end time of the booking (HH:mm).',
        format: 'time'
    })
    endTime: string = '';

    @ApiProperty({
        example: 'scheduled',
        description: 'The type of the appointment.',
        enum: TypeAppointment
    })
    type: TypeAppointment = TypeAppointment.SCHEDULED;

    @ApiProperty({
        example: 'confirmed',
        description: 'The status of the booking.',
        enum: AppointmentStatus
    })
    status: AppointmentStatus = AppointmentStatus.CONFIRMED;
}