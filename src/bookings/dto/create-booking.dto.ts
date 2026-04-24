import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Matches } from 'class-validator';

export class CreateBookingDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'ID of the user making the booking.',
        format: 'uuid'
    })
    @IsUUID()
    userId: string = '';

    @ApiProperty({
        example: '722e2345-e52b-02d1-a324-225530367080',
        description: 'ID of the specialist for the booking.',
        format: 'uuid'
    })
    @IsUUID()
    specialistId: string = '';

    @ApiProperty({
        example: ['123e4567-e89b-12d3-a456-426614174000'],
        description: 'IDs of the services for the booking.',
        format: 'uuid',
        isArray: true
    })
    @IsUUID('all', { each: true })
    servicesIds: string[] = [];

    @ApiProperty({
        example: '2026-01-01',
        description: 'Date of the booking (YYYY-MM-DD).',
        format: 'date'
    })
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'date must be in YYYY-MM-DD format'
    })
    date: string = '';
    
    @ApiProperty({
        example: '08:00',
        description: 'Start time of the booking (HH:mm).',
        format: 'time'
    })
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'startTime must be in HH:mm format'
    })
    startTime: string = '';
}
