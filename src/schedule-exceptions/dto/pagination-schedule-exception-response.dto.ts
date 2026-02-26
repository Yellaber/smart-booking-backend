import { ScheduleExceptionResponseDto } from './schedule-exception-response.dto';

export class PaginationScheduleExceptionResponseDto {
  total: number;
  scheduleExceptions: ScheduleExceptionResponseDto[];
}