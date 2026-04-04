import { PaginationScheduleExceptionResponseDto, ScheduleExceptionResponseDto } from '../dto';
import { ScheduleException } from '../entities/schedule-exception.entity';

export class ScheduleExceptionResponse {
    static get(scheduleException: ScheduleException): ScheduleExceptionResponseDto {
        const { isActive, specialist, ...restScheduleException } = scheduleException;
        return restScheduleException;
    }

    static getPagination(total: number, scheduleExceptions: ScheduleException[]): PaginationScheduleExceptionResponseDto {
        const schedulesResponse = scheduleExceptions.map(scheduleException => this.get(scheduleException));
        return { total, scheduleExceptions: schedulesResponse };
    }
}