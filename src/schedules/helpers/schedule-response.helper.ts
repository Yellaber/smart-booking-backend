import { PaginationScheduleResponseDto, ScheduleResponseDto } from '../dto';
import { Schedule } from '../entities/schedule.entity';

export class ScheduleResponse {
    static get(schedule: Schedule): ScheduleResponseDto {
        const { isActive, specialist, ...restSchedule } = schedule;
        return restSchedule;
    }

    static getPagination(total: number, schedules: Schedule[]): PaginationScheduleResponseDto {
        const schedulesResponse = schedules.map(schedule => this.get(schedule));
        return { total, schedules: schedulesResponse };
    }
}