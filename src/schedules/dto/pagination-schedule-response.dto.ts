import { ApiProperty } from '@nestjs/swagger';
import { ScheduleResponseDto } from './schedule-response.dto';

export class PaginationScheduleResponseDto {
    @ApiProperty({
        example: 1,
        description: 'Total number of schedules.',
        format: 'number'
    })
    total: number = 0;
    
    @ApiProperty({
        example: [
            {
                id: '1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5d6',
                dayOfWeek: 'Monday',
                startTime: '08:00:00',
                endTime: '17:00:00'
            },
        ],
        type: [ ScheduleResponseDto ],
        description: 'List of schedules'
    })
    schedules: ScheduleResponseDto[] = [];
}