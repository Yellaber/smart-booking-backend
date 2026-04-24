import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Matches } from 'class-validator';
import { DayOfWeek } from '../interfaces/day-of-week.enum';

export class CreateScheduleDto {
  @ApiProperty({
    example: 'monday',
    description: 'Day of the week for the schedule.',
    enum: DayOfWeek
  })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek = DayOfWeek.MONDAY;

  @ApiProperty({
    example: '08:00',
    description: 'Start time of the schedule (HH:mm).',
    format: 'time'
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format'
  })
  startTime: string = '';

  @ApiProperty({
    example: '17:00',
    description: 'End time of the schedule (HH:mm).',
    format: 'time'
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm format'
  })
  endTime: string = '';
}
