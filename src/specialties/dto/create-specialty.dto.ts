import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSpecialtyDto {
    @ApiProperty({
        example: 'Especialty name',
        description: 'The name of the specialty. It must have 30 characters maximum.',
        format: 'string',
    })
    @IsString()
    @MinLength(1)
    @MaxLength(30)
    name: string;

    @ApiProperty({
        example: 'This is a description about the specialty.',
        description: 'The description of the specialty. It must have 150 characters maximum.',
        format: 'string',
        required: false
    })
    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(150)
    description?: string;
}
