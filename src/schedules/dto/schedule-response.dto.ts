import { ApiProperty } from '@nestjs/swagger';

export class ScheduleResponseDto {
    @ApiProperty({
        example: '1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5d6',
        description: 'Unique identifier of the schedule.',
        format: 'uuid'
    })
    id: string;

    @ApiProperty({
        example: 'monday',
        description: 'Day of the week for the schedule.',
        enum: [ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday' ]
    })
    dayOfWeek: string;

    @ApiProperty({
        example: '08:00:00',
        description: 'Start time of the schedule.',
        format: 'time'
    })
    startTime: string;

    @ApiProperty({
        example: '17:00:00',
        description: 'End time of the schedule.',
        format: 'time'
    })
    endTime: string;
}