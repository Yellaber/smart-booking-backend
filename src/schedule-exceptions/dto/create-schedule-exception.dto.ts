import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { TypeScheduleException } from '../interfaces/type-schedule-exception.enum';

export class CreateScheduleExceptionDto {
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'date must be in YYYY-MM-DD format'
    })
    date: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'startTime must be in HH:mm format'
    })
    @IsOptional()
    startTime?: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'startTime must be in HH:mm format'
    })
    @IsOptional()
    endTime?: string;

    @IsEnum(TypeScheduleException)
    type: TypeScheduleException;

    @IsString()
    @IsOptional()
    reason?: string;
}
