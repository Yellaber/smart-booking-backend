import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateSpecialtyDto } from './create-specialty.dto';

export class UpdateSpecialtyDto extends PartialType(CreateSpecialtyDto) {
    @ApiProperty({
        example: true,
        description: 'The status of the specialty.',
        format: 'boolean',
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
