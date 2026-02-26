import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { TypeScheduleException } from '../interfaces/type-schedule-exception.enum';

export class CreateScheduleExceptionDto {
    @ApiProperty({
        example: '2026-01-01',
        description: 'Date of the schedule exception (YYYY-MM-DD).',
        format: 'date'
    })
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'date must be in YYYY-MM-DD format'
    })
    date: string;

    @ApiProperty({
        example: '08:00',
        description: 'Start time of the schedule exception (HH:mm).',
        format: 'time',
        required: false
    })
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'startTime must be in HH:mm format'
    })
    @IsOptional()
    startTime?: string;

    @ApiProperty({
        example: '17:00',
        description: 'End time of the schedule exception (HH:mm).',
        format: 'time',
        required: false
    })
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'endTime must be in HH:mm format'
    })
    @IsOptional()
    endTime?: string;

    @ApiProperty({
        example: 'extra',
        description: 'Type of the schedule exception.',
        enum: TypeScheduleException
    })
    @IsEnum(TypeScheduleException)
    type: TypeScheduleException;

    @ApiProperty({
        example:'This is the reason for the schedule exception.',
        description: 'Reason for the schedule exception.',
        format: 'string',
        required: false
    })
    @IsString()
    @IsOptional()
    reason?: string;
}
