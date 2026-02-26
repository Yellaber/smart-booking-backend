import { ApiProperty } from '@nestjs/swagger';
import { ScheduleExceptionResponseDto } from './schedule-exception-response.dto';

export class PaginationScheduleExceptionResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Total number of schedule exceptions.',
    format: 'number'
  })
  total: number;

  @ApiProperty({
    example: [
      {
        id: '1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4',
        date: '2023-01-01',
        startTime: '08:00',
        endTime: '17:00',
        type: 'extra',
        reason: 'This is the reason for the schedule exception.'
      },
    ],
    type: [ ScheduleExceptionResponseDto ],
    description: 'List of schedule exceptions.'
  })
  scheduleExceptions: ScheduleExceptionResponseDto[];
}