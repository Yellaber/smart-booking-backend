import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateSpecialistDto {
    @ApiProperty({
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        description: 'User id.',
        format: 'uuid'
    })
    @IsUUID()
    userId: string = '';

    @ApiProperty({
        example: ['f47ac10b-58cc-4372-a567-0e02b2c3d479', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'],
        description: 'IDs of the services for the specialist.',
        format: 'uuid',
        isArray: true
    })
    @IsUUID('all', { each: true })
    servicesIds: string[] = [];
}
