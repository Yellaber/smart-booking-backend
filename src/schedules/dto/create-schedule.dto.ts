import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Matches } from 'class-validator';
import { DayOfWeek } from '../interfaces/day-of-week.enum';

export class CreateScheduleDto {
  @ApiProperty({
    example: 'Monday',
    description: 'Day of the week for the schedule.',
    enum: DayOfWeek,
  })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty({
    example: '08:00:00',
    description: 'Start time of the schedule (HH:mm:ss).',
    format: 'time',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm:ss format',
  })
  startTime: string;

  @ApiProperty({
    example: '17:00:00',
    description: 'End time of the schedule (HH:mm:ss).',
    format: 'time',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm:ss format',
  })
  endTime: string;
}
