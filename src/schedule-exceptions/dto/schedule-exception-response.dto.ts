import { TypeScheduleException } from '../interfaces/type-schedule-exception.enum';

export class ScheduleExceptionResponseDto {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    type: TypeScheduleException;
    reason: string;
}