import { ApiProperty } from '@nestjs/swagger';
import { TypeScheduleException } from '../interfaces/type-schedule-exception.enum';

export class ScheduleExceptionResponseDto {
    @ApiProperty({
        example: '1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4',
        description: 'Unique identifier of the schedule exception.',
        format: 'uuid'
    })
    id: string = '';

    @ApiProperty({
        example: '2023-01-01',
        description: 'Date of the schedule exception (YYYY-MM-DD).',
        format: 'date'
    })
    date: string = '';

    @ApiProperty({
        example: '08:00',
        description: 'Start time of the schedule exception (HH:mm).',
        format: 'time'
    })
    startTime: string = '';

    @ApiProperty({
        example: '17:00',
        description: 'End time of the schedule exception (HH:mm).',
        format: 'time'
    })
    endTime: string = '';

    @ApiProperty({
        example: 'extra',
        description: 'Type of the schedule exception.',
        enum: TypeScheduleException
    })
    type: TypeScheduleException = TypeScheduleException.EXTRA;

    @ApiProperty({
        example:'This is the reason for the schedule exception.',
        description: 'Reason for the schedule exception.',
        format: 'string'
    })
    reason: string = '';
}