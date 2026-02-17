import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { CreateSpecialistDto } from './create-specialist.dto';

export class UpdateSpecialistDto extends PartialType(CreateSpecialistDto) {
    @ApiProperty({
        example: true,
        description: 'Indicates whether the specialist is active or not.',
        format: 'boolean'
    })
    @IsBoolean()
    isActive: boolean;
}
