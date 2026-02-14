import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateSpecialistDto } from './create-specialist.dto';

export class UpdateSpecialistDto extends PartialType(CreateSpecialistDto) {
    @ApiProperty({
        example: true,
        description: 'Specialist availability.',
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isAvailable?: boolean;
}
