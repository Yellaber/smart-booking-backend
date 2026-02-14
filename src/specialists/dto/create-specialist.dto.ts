import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateSpecialistDto {
    @ApiProperty({
        example: 't1g2c3d4-e5f6-7g8h-9i0j-k3l2x3n4o5p6',
        description: 'User id.',
        format: 'uuid'
    })
    @IsUUID()
    userId: string;
}
